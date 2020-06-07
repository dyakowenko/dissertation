import { Component, OnInit } from '@angular/core';
import { DataStoreService } from 'src/app/core/services/data-store.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  constructor(
    private dataStoreService: DataStoreService
  ) { }

  ngOnInit() {
  }

  get topsis() {
    return this.dataStoreService.topsisResult;
  }

  get vicor() {
    return this.dataStoreService.vicorResult;
  }

  getAlternativeName(id: number): string {
    return this.dataStoreService.alternatives.find(x => x.id === id).name;
  }

}
