import { AboutComponent } from './about/about.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AuthGuard } from './auth/_helpers';
import { ContractsComponent } from './contracts/contracts.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './auth/register/register.component';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './auth/user/user.component';
import { LogsComponent } from './logs/logs.component';
import { SequencesComponent } from './sequences/sequences.component';
import { StepsComponent } from './steps/steps.component';
import { CustomFieldsComponent } from './custom-fields/custom-fields.component';
import { TransferEthComponent } from './transfer-eth/transfer-eth.component';
import { TransferTokenComponent } from './transfer-token/transfer-token.component';
import { ContractDeploymentComponent } from './contract-deployment/contract-deployment.component';
import { BtcTransferComponent } from './btc-transfer/btc-transfer.component';
import { BtcSettingsComponent } from './btc-settings/btc-settings.component';
import { BtcInitComponent } from './btc-init/btc-init.component';
import { BtcComponent } from './btc/btc.component';
import {BlocksComponent} from './blocks/blocks.component';
import { BlocksDiagramComponent } from './blocks-diagram/blocks-diagram.component';
import { TutorialComponent } from './tutorial/tutorial.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'accounts', component: AccountsComponent,canActivate:[AuthGuard] },
  { path: 'accounts/:_id', component: AccountsComponent,canActivate:[AuthGuard]},
  { path: 'btc', component: BtcComponent,canActivate:[AuthGuard]},
  { path: 'btc/:section', component: BtcComponent,canActivate:[AuthGuard]},

  // { path: 'btc/init', component: BtcInitComponent,canActivate:[AuthGuard]},
  // { path: 'btc/settings', component: BtcSettingsComponent,canActivate:[AuthGuard]},
  // { path: 'btc/transfer', component: BtcTransferComponent,canActivate:[AuthGuard]},

  { path: 'contracts', component: ContractsComponent,canActivate:[AuthGuard]},
  { path: 'contractDeployment', component: ContractDeploymentComponent,canActivate:[AuthGuard]},
  { path: 'contractDeployment/:_id', component: ContractDeploymentComponent,canActivate:[AuthGuard]},
  { path: 'contracts/:_id', component: ContractsComponent,canActivate:[AuthGuard]},
  { path: 'transfereth', component: TransferEthComponent},
  { path: 'transfereth', component: TransferEthComponent}, 
  { path: 'transfertoken', component: TransferTokenComponent},
  { path: 'transfertoken', component: TransferTokenComponent}, 
  { path: 'customfields', component: CustomFieldsComponent},
  { path: 'customfields/:field_id', component: CustomFieldsComponent},   
  { path: 'home', redirectTo: '' },
  { path: 'login', component: LoginComponent },
  { path: 'logout',component: LogoutComponent },
  { path: 'logs', component: LogsComponent,canActivate:[AuthGuard]},
  { path: 'logs/:sequence_id', component: LogsComponent,canActivate:[AuthGuard]},  
  { path: 'register', component: RegisterComponent },
  { path: 'sequences', component: SequencesComponent},
  { path: 'sequences/:sequence_id', component: SequencesComponent}, 
  { path: 'steps', component: StepsComponent},
  { path: 'tutorial', component: TutorialComponent},
  { path: 'steps/:sequence_id', component: StepsComponent}, 
  { path: 'steps/:sequence_id/:step_id', component: StepsComponent}, 
  { path: 'user', component: UserComponent },
  { path: 'blocks', component: BlocksComponent },
  { path: 'blocks/diagram', component: BlocksDiagramComponent },
  

];

@NgModule({
  imports: [
RouterModule.forRoot(routes)
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
