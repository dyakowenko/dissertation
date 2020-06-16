import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataStoreService } from 'src/app/core/services/data-store.service';
import { Dataset } from 'src/app/shared/models/dataset.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(
    private dataStoreService: DataStoreService,
    private router: Router
  ) { }

  goToCalc() {
    this.dataStoreService.currentDataset = new Dataset();
    this.dataStoreService.criterionsList = JSON.parse(JSON.stringify(this.dataStoreService.criterions));
    this.router.navigate(['/calc']);
  }

}
