import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './core/services/firebase.service';
import { DataStoreService } from './core/services/data-store.service';
import { Dataset } from './shared/models/dataset.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private dataStoreService: DataStoreService
  ) { }

  ngOnInit() {
    this.getDatasets();
  }

  getDatasets() {
    this.firebaseService
      .getDatasets()
      .subscribe(data => {
        console.log(123);
        this.dataStoreService.datasets = data.map(e => {
          const dataset = e.payload.doc.data() as Dataset;
          return {
            id: e.payload.doc.id,
            vicorV: dataset.vicorV,
            alternatives: dataset.alternatives,
            criterions: dataset.criterions,
            vicorResult: dataset.vicorResult,
            topsisResult: dataset.topsisResult
          } as Dataset;
        });
      });
  }

  goToCalc() {
    this.dataStoreService.currentDataset = new Dataset();
    this.dataStoreService.criterionsList =  [...this.dataStoreService.criterions];
    this.router.navigate(['/calc']);
  }

}
