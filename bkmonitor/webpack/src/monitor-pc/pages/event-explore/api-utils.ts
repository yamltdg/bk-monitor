/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
 *
 * ---------------------------------------------------
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
import { eventDownloadTopK, eventTopK, eventViewConfig } from 'monitor-api/modules/data_explorer';

import type { ITopKField, ITopKRequestParams } from './typing';
export enum APIType {
  APM = 'apm', // apm
  MONITOR = 'monitor', // monitor default
}

/**
 * @description: 获取事件top k
 * @param params
 * @param type
 * @returns
 */
export const getEventTopK = (params: ITopKRequestParams, type = APIType.MONITOR): Promise<ITopKField[]> => {
  const apiFunc = type === APIType.APM ? eventTopK : eventTopK;
  return apiFunc(params).catch(() => []);
};

export const getEventViewConfig = (params: any) => eventViewConfig(params).then((res: any) => res.data);

export const getDownloadTopK = (params, type = APIType.MONITOR) => {
  const apiFunc = type === APIType.APM ? eventDownloadTopK : eventDownloadTopK;
  return apiFunc(params).catch(() => []);
};
