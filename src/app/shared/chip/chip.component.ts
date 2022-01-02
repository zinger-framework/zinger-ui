import {forwardRef, Component, ElementRef, EventEmitter, HostListener, Input, Output, 
  ViewChild, Inject, ViewEncapsulation, ChangeDetectionStrategy, InjectionToken} from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';

export enum KeyCodes {
  Backspace = 8,
  Tab = 9,
  Enter = 13,
  Escape = 27,
  LeftArrow = 37,
  UpArrow = 38,
  RightArrow = 39,
  DownArrow = 40,
  Comma = 188,
}

// Reference - https://github.com/coryrylan/ngx-lite/tree/master/projects/ngx-input-tag

export type ChipFormater = (chip: string) => string;

@Component({
  selector: 'chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ChipComponent),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ChipComponent implements ControlValueAccessor {

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;
  @Input() chipSuggestions: string[] = [];
  @Input() maxChipLength = 25;
  @Input() maxNumberOfChips = 1000;
  @Output() readonly textChange = new EventEmitter<string>();

  private _value: string[] = [];
  private prevChipInput = '';
  private currentNumberOfChips = 0;
  private chipValueError: { message: string } | null = null;
  private chipFormatter: ChipFormater;

  constructor() {
    this.chipFormatter = formatter
  }

  ngOnInit(): void {
  }

  onChange = (_value: string[]) => {};

  onTouched = () => {};

  registerOnChange(fn: (value: string[]) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  writeValue(value: string[]) {
    if (value) {
      this.value = value.map((v) => this.chipFormatter(v));
      this.setCurrentNumberOfChips();
    }
  }

  validate() {
    return this.chipValueError;
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    if (
      this.inputElement &&
      !this.inputElement.nativeElement.contains(event.target) &&
      this.inputElement.nativeElement.value
    ) {
      this.addChip(this.inputElement.nativeElement.value);
    }
  }

  addChip(chip: string) {
    const formattedChip = this.chipFormatter(chip);
    const chipIsEmpty = formattedChip.length === 0;
    const invalidChipLength =
      !formattedChip.length ||
      (this.maxChipLength && formattedChip.length > this.maxChipLength);
    const duplicateChip = this.value.indexOf(formattedChip) > -1;
    const exceedsMaxNumberOfChips =
      this.currentNumberOfChips > this.maxNumberOfChips;

    if (!chipIsEmpty && invalidChipLength) {
      this.chipValueError = {
        message: `Chip length cannot exceed ${this.maxChipLength} characters`,
      };
    }

    if (duplicateChip) {
      this.chipValueError = { message: 'Cannot add duplicate Chip' };
    }

    if (exceedsMaxNumberOfChips) {
      const plural = this.maxNumberOfChips === 1 ? '' : 's';
      this.chipValueError = {
        message: `Cannot exceed ${this.maxNumberOfChips} chip${plural}`,
      };
    }

    if (
      !chipIsEmpty &&
      !invalidChipLength &&
      !duplicateChip &&
      !exceedsMaxNumberOfChips &&
      this.inputElement
    ) {
      this.chipValueError = null;
      this.value.push(formattedChip);
      this.setCurrentNumberOfChips();
      this.inputElement.nativeElement.value = '';
    }

    this.value = this.value;
    this.focus();
  }

  addChipEvent(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    this.chipValueError = null;
    this.value = this.value;

    this.textChange.emit(input.value);
    if (
      event.keyCode === KeyCodes.Backspace &&
      this.prevChipInput.length === 0
    ) {
      this._value.pop();
      this.setCurrentNumberOfChips();
    } else if (
      event.keyCode === KeyCodes.Enter ||
      event.keyCode === KeyCodes.Comma ||
      event.keyCode === KeyCodes.Tab
    ) {
      this.addChip(input.value);
    }

    this.prevChipInput = input.value;
  }

  preventDefaultTabBehavior(event: KeyboardEvent) {
    if (event.keyCode === KeyCodes.Tab && this.prevChipInput.length > 0) {
      event.preventDefault();
    }
  }

  addSuggestedValue(chip: string) {
    this.addChip(chip);
  }

  removeChip(chip: string, event: any) {
    if (event.keyCode !== KeyCodes.Enter) {
      this.value = this._value.filter((t) => t !== chip);
      this.setCurrentNumberOfChips();
    }
  }

  focus() {
    this.inputElement?.nativeElement.focus();
  }

  setCurrentNumberOfChips() {
    this.currentNumberOfChips = this.value.length
      ? this.value.toString().split(',').length
      : 0;
  }
}

export function formatter(chip: string): string {
  return chip.trim().replace(/(\s|-)+/g, '-').replace(/\,/g, '').toLowerCase();
}
