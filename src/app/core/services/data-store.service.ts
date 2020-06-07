import { Injectable } from '@angular/core';
import { Criterion, IdValue } from 'src/app/shared/models/criterion.model';
import { Alternative } from 'src/app/shared/models/alternative.model';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {

  alternativesMinCount = 2;
  criterionsMinCount = 2;
  vicorV: number;
  vicorResult: IdValue[] = [];
  topsisResult: IdValue[] = [];

  alternatives: Alternative[] = [];
  criterions: Criterion[] = [
    {
      id: 1,
      name: 'Сроки доставки',
      countable: true
    },
    {
      id: 2,
      name: 'Стоимость доставки',
      countable: true
    },
    {
      id: 3,
      name: 'Условия платежа',
      qualityList: [
        { id: 0, value: 'Нет нужного варианта' },
        { id: 1, value: 'Есть' }
      ]
    },
    {
      id: 4,
      name: 'Качество продукции',
      qualityList: [
        { id: 1, value: 'Ужасное' },
        { id: 2, value: 'Плохое' },
        { id: 3, value: 'Удовлетворительное' },
        { id: 4, value: 'Хорошее' },
        { id: 5, value: 'Отличное' }
      ]
    },
    {
      id: 5,
      name: 'Цена продукции',
      countable: true
    },
    {
      id: 6,
      name: 'Местоположение поставщика',
      countable: true
    },
    {
      id: 7,
      name: 'Надежность поставщика',
      qualityList: [
        { id: 1, value: 'Не надежный' },
        { id: 2, value: 'Не очень надежный' },
        { id: 3, value: 'Надежный' },
        { id: 4, value: 'Очень надежный' }
      ]
    },
    {
      id: 8,
      name: 'Сервисные услуги',
      qualityList: [
        { id: 0, value: 'Нет' },
        { id: 1, value: 'Есть' }
      ]
    },
    {
      id: 9,
      name: 'Количество лет на рынке',
      countable: true
    },
    {
      id: 10,
      name: 'Минимальный объём заказа',
      countable: true
    },
    {
      id: 11,
      name: 'Ассортимент',
      countable: true
    },
    {
      id: 12,
      name: 'Производственные мощности',
      countable: true
    },
    {
      id: 13,
      name: 'Количество оптовых клиентов',
      countable: true
    },
    {
      id: 14,
      name: 'Возможность компромиссов',
      qualityList: [
        { id: 0, value: 'Нет возможности' },
        { id: 1, value: 'Есть' }
      ]
    },
    {
      id: 15,
      name: 'Наличие информационной системы связи и обработки заказов',
      qualityList: [
        { id: 0, value: 'Нет' },
        { id: 1, value: 'Есть' }
      ]
    },
    {
      id: 16,
      name: 'Отношение к покупателю',
      qualityList: [
        { id: 1, value: 'Ужасное' },
        { id: 2, value: 'Плохое' },
        { id: 3, value: 'Удовлетворительное' },
        { id: 4, value: 'Хорошее' },
        { id: 5, value: 'Отличное' }
      ]
    },
    {
      id: 17,
      name: 'Оформление товара',
      qualityList: [
        { id: 1, value: 'Ужасное' },
        { id: 2, value: 'Плохое' },
        { id: 3, value: 'Удовлетворительное' },
        { id: 4, value: 'Хорошее' },
        { id: 5, value: 'Отличное' }
      ]
    },
    {
      id: 18,
      name: 'Кредитоспособность и финансовое положение поставщика',
      qualityList: [
        { id: 1, value: 'Ужасное' },
        { id: 2, value: 'Плохое' },
        { id: 3, value: 'Удовлетворительное' },
        { id: 4, value: 'Хорошее' },
        { id: 5, value: 'Отличное' }
      ]
    },
    {
      id: 19,
      name: 'Готовность поставщика к выполнению заказов и работе с заказчиками без предварительной оплаты, работа в кредит, предоставление рассрочек',
      qualityList: [
        { id: 0, value: 'Нет' },
        { id: 1, value: 'Есть' }
      ]
    },
    {
      id: 20,
      name: 'Наличие системы управления качеством',
      qualityList: [
        { id: 0, value: 'Нет' },
        { id: 1, value: 'Есть' }
      ]
    },
    {
      id: 21,
      name: 'Способность поставщика обслуживать запчастями поставленное оборудование в течение всего срока его эксплуатации',
      qualityList: [
        { id: 0, value: 'Нет' },
        { id: 1, value: 'Есть' }
      ]
    }
  ];

}