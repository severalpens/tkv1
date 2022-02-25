import { AboutComponent } from './about/about.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm/confirm.component';
import { ContractsComponent } from './contracts/contracts.component';
import { CustomFieldsComponent } from './custom-fields/custom-fields.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule }   from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from './auth/_helpers';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { LogsComponent } from './logs/logs.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule }   from '@angular/forms';
import { RegisterComponent } from './auth/register/register.component';
import { UserComponent } from './auth/user/user.component';
import { SequencesComponent } from './sequences/sequences.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { StepsComponent } from './steps/steps.component';
import { SequenceHeaderComponent } from './sequence-header/sequence-header.component';
import { TransferEthComponent } from './transfer-eth/transfer-eth.component';
import { TransferTokenComponent } from './transfer-token/transfer-token.component';
import { ContractDeploymentComponent } from './contract-deployment/contract-deployment.component';
import { BtcInitComponent } from './btc-init/btc-init.component';
import { BtcComponent } from './btc/btc.component';
import { BtcTransferComponent } from './btc-transfer/btc-transfer.component';
import { BtcHeaderComponent } from './btc-header/btc-header.component';
import { BtcSettingsComponent } from './btc-settings/btc-settings.component';
import { ContractReadonlyComponent } from './contract-readonly/contract-readonly.component';
import { FormGroup, FormControl } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import {MatSelectModule} from '@angular/material/select'
import {  MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BtcBalancesComponent } from './btc-balances/btc-balances.component';
import { BlocksComponent } from './blocks/blocks.component';
import { BlocksDiagramComponent } from './blocks-diagram/blocks-diagram.component';
import { TutorialComponent } from './tutorial/tutorial.component';

@NgModule({
  declarations: [
    AboutComponent,
    AccountsComponent,
    AppComponent,
    ConfirmComponent,
    ContractsComponent,
    CustomFieldsComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    LogoutComponent,
    LogsComponent,
    RegisterComponent,
    SequenceHeaderComponent,
    SequencesComponent,
    SpinnerComponent,
    StepsComponent,
    UserComponent,
    TransferEthComponent,
    TransferTokenComponent,
    ContractDeploymentComponent,
    BtcInitComponent,
    BtcTransferComponent,
    BtcHeaderComponent,
    BtcSettingsComponent,
    ContractReadonlyComponent,
    BtcBalancesComponent,
    BtcComponent,
    BlocksComponent,
    BlocksDiagramComponent,
    TutorialComponent,
   
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
