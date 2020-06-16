import { Component, OnInit } from '@angular/core';
import { DataStoreService } from 'src/app/core/services/data-store.service';
import { Dataset } from 'src/app/shared/models/dataset.model';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { Alternative } from 'src/app/shared/models/alternative.model';

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.scss']
})
export class DatasetsComponent {

  constructor(
    private dataStoreService: DataStoreService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  get datasets(): Dataset[] {
    return this.dataStoreService.datasets;
  }

  getTopsisResult(dataset: Dataset, alternativeId: number) {
    return dataset.topsisResult.find(x => x.id === alternativeId).value.toFixed(2);
  }

  getVicorResult(dataset: Dataset, alternativeId: number) {
    return dataset.vicorResult.find(x => x.id === alternativeId).value.toFixed(2);
  }

  isBestAlt(dataset: Dataset, alt: Alternative) {
    let otherAltsRes = dataset.topsisResult.filter(x => x.id !== alt.id);
    let currentAltsRes = dataset.topsisResult.find(x => x.id === alt.id);
    const isBestByTopsis = !otherAltsRes.some(x => x.value > currentAltsRes.value);
    otherAltsRes = dataset.vicorResult.filter(x => x.id !== alt.id);
    currentAltsRes = dataset.vicorResult.find(x => x.id === alt.id);
    const isBestByVicor = !otherAltsRes.some(x => x.value < currentAltsRes.value);
    return isBestByTopsis && isBestByVicor;
  }

  chooseDataset(dataset: Dataset) {
    this.dataStoreService.currentDataset = dataset;
    this.dataStoreService.criterionsList = [...this.dataStoreService.criterions];
    dataset.criterions.forEach(x => {
      const idx = this.dataStoreService.criterionsList.findIndex(y => y.id === x.id);
      if (idx !== -1) {
        this.dataStoreService.criterionsList[idx] = x;
      }
    });
    this.router.navigate(['/calc']);
  }

  deleteDataset(datasetId: string) {
    this.firebaseService.deleteDataset(datasetId);
    this.dataStoreService.datasets = this.datasets.filter(x => x.id !== datasetId);
  }

}
