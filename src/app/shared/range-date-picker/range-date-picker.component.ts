import {Component, EventEmitter, Input, Output} from '@angular/core'
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap'
import {BaseComponent} from "../../base.component"

@Component({
  selector: 'range-date-picker',
  templateUrl: './range-date-picker.component.html',
  styleUrls: ['./range-date-picker.component.css']
})
export class RangeDatePickerComponent extends BaseComponent {

  @Input() hoveredDate: NgbDate | null
  @Input() fromDate: NgbDate | null
  @Input() toDate: NgbDate | null
  @Output() dateSelectionEvent = new EventEmitter<Map<string, NgbDate>>()
  dateRange: string = 'yyyy-MM-dd to yyyy-MM-dd'

  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    super()
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date
    } else {
      this.toDate = null
      this.fromDate = date
    }

    let selectedDates = new Map()
    selectedDates.set('fromDate', this.fromDate)
    selectedDates.set('toDate', this.toDate)
    this.dateSelectionEvent.emit(selectedDates)

    if(this.fromDate) this.dateRange = this.formatter.format(this.fromDate).toString() 
    if(this.toDate) this.dateRange += ' to ' + this.formatter.format(this.toDate).toString()
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate)
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date)
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input)
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue
  }

}
