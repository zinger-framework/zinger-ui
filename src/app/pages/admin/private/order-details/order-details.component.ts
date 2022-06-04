import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {BaseComponent} from "../../../../base.component";
import {OrderService} from "../../../../core/service/admin/order.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ExtendedFormControl} from "../../../../core/utils/extended-form-control.utils";
import {handleError} from "../../../../core/utils/common.utils";
import {ToastrService} from "ngx-toastr";
import {APP_ROUTES} from "../../../../core/utils/constants.utils";

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent extends BaseComponent {
  breadCrumbData = [{label: 'Home', link: APP_ROUTES.DASHBOARD}, {label: 'Shops', link: APP_ROUTES.SHOP}]
  shopId: number
  orderId: number
  orderDetailsForm: FormGroup
  data = {}
  statuses = {
    order_status: ['created', 'placed', 'delivery_pending', 'delivered', 'cancelled'],
    payment_status: ['pending', 'completed', 'failed', 'refund_pending', 'refund_failed', 'refund_completed']
  }  

  constructor(private fb: FormBuilder, private orderService: OrderService, private router: Router, 
  	private route: ActivatedRoute, private el: ElementRef, private toastr: ToastrService) {
    super()
    this.route.params.subscribe(params => {
      this.shopId = params['shop_id']
      this.orderId = params['id']
      this.breadCrumbData.push(
        {label: String(this.shopId), link: `${APP_ROUTES.SHOP}/${this.shopId}`},
        {label: 'Orders', link: `${APP_ROUTES.SHOP}/${this.shopId}/order`},
        {label: String(this.orderId), link: ``}
      )
    });

    this.orderDetailsForm = this.fb.group({
    	order_status: new ExtendedFormControl('', [], 'order_status'),
    	className: 'order-details'
    })
  }

  ngOnInit(): void {
  	this.getOrderDetails()
  }

  getOrderDetails() {
    this.orderService.getOrderDetails(this.shopId, this.orderId)
      .then(response => {
        this.data = response['data']['order']
      })
      .catch(error => {
        this.toastr.error(error['error']['message']);       
        this.router.navigate([APP_ROUTES.DASHBOARD])
      })  	
  }

  updateOrderStatus(status) {
  	let requestBody = {'order_status': status}
    this.orderService.updateOrderDetails(this.shopId, this.orderId, requestBody)
      .then(response => {
        this.getOrderDetails()
      })
      .catch(error => {
        this.toastr.error(error['error']['message']);       
        this.router.navigate([APP_ROUTES.DASHBOARD])
      })  	
  }
}
