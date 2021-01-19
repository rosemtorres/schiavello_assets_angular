import { Component, OnInit } from '@angular/core';
import { UserService } from "../users.service";
import { UserModel } from "../users.model";
import { ActivatedRoute, Params } from "@angular/router";
import { FormGroup, FormControl } from '@angular/forms';
declare let $: any;

@Component({
	selector: 'app-user-edit',
	templateUrl: './user-edit.component.html',
	styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

	userDetail: UserModel;
	id: number;
	userCreated: boolean = false;;
	objectKeys = Object.keys;
	genders = ['male', 'female'];
	userForm: FormGroup;
	status_vals = {
		end: 'End',
		in_use: 'In Use',
		spare: 'Spare'
	};
	selectedAllowedAssetsArray = [];
	
	allowed_asset_vals = {
		mac_office:'Mac Office',
		mac_office_365:'Microsoft Office 365 - en-us',
		mac_office_2007:'Microsoft Office Word MUI (English) 2007',
		mac_office_2010:'Microsoft Office Word MUI (English) 2010'
	};

	constructor(
		private userService:UserService,
		private route:ActivatedRoute
	) { }


	ngOnInit(): void {
		this.userDetail = new UserModel(0,'','','','','','','','','','','',0,'','','','');


		this.route.params.subscribe(
			(params:Params) => {
				this.id = +params['id'];
				this.userService.getUser(this.id)
				.subscribe((posts)=>{
					this.userDetail = posts[0];
					this.selectedAllowedAssetsArray = this.userDetail.allowed_asset.split(",");
					for (let i = 0; i < this.selectedAllowedAssetsArray.length; i++) {
						this.selectedAllowedAssetsArray[i] = i+": '"+this.selectedAllowedAssetsArray[i]+"'";
					}
					$('.allowed_asset').val(this.selectedAllowedAssetsArray).trigger('change');
				});
			}
		)

		$('.allowed_asset').select2();
		this.userForm = new FormGroup({
			user_id: new FormControl(this.userDetail.user_id),
			sam_account_name: new FormControl(null),
			computer_name_from_ad: new FormControl(null),
			company: new FormControl(null),
			status: new FormControl(null),
			first_name: new FormControl(null),
			last_name: new FormControl(null),
			email: new FormControl(null),
			manu: new FormControl(null),
			model: new FormControl(null),
			type: new FormControl(null),
			date_created: new FormControl(null),
			os: new FormControl(null),
			memory: new FormControl(null),
			processor: new FormControl(null),
			purchase_value: new FormControl(null),
			allowed_asset: new FormControl(null),
		});
	}

	onSubmit() {
		console.log(this.userForm.value);
		return;
		this.userService.editUser(this.userForm.value)
		.subscribe((posts)=>{
			if (posts === true) {
				this.userCreated = true;
			}
		});
	}

}