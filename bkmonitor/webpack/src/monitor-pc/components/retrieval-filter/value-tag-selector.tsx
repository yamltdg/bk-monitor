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
import { Component, Prop, Watch } from 'vue-property-decorator';
import { Component as tsc } from 'vue-tsx-support';

import AutoWidthInput from './auto-width-input';
import TextHighlighter from './text-highlighter';
import { onClickOutside } from './utils';
import ValueTagInput from './value-tag-input';

import './value-tag-selector.scss';

export interface IValue {
  id: string;
  name: string; // 暂不显示 预留
}

interface IProps {
  options?: IValue[];
  loading?: boolean;
  value?: IValue[];
  onChange?: (v: IValue[]) => void;
  onSearch?: (v: string) => void;
}

@Component
export default class ValueTagSelector extends tsc<IProps> {
  @Prop({ type: Array, default: () => [] }) options: IValue[];
  @Prop({ type: Boolean, default: false }) loading: boolean;
  @Prop({ type: Array, default: () => [] }) value: IValue[];
  /* tag列表 */
  localValue: IValue[] = [];
  /* 可选项 */
  localOptions: IValue[] = [];
  /* 是否显示下拉框 */
  isShowDropDown = false;
  /* 当前光标位置 */
  activeIndex = -1;
  /* 当前光标位置输入值 */
  inputValue = '';
  /* 可选项悬停位置 */
  hoverActiveIndex = -1;
  /* 输入框是否聚焦 */
  isFocus = false;

  @Watch('options', { immediate: true })
  handleWatchOptions() {
    const localOptions = [];
    const valueSet = new Set(this.localValue.map(item => item.id));
    for (const item of this.options) {
      if (!valueSet.has(item.id)) {
        localOptions.push(item);
      }
    }
    this.localOptions = localOptions;
  }

  @Watch('loading', { immediate: true })
  handleWatchLoading() {
    if (this.loading) {
      this.handleShowShowDropDown(true);
    }
  }

  @Watch('value', { immediate: true })
  handleWatchValue() {
    this.localValue = JSON.parse(JSON.stringify(this.value));
  }

  /**
   * @description 下拉选项点击事件
   * @param item
   */
  handleCheck(item: IValue) {
    this.localValue.push(item);
    this.handleChange();
  }

  /**
   * @description 点击输入框
   */
  handleClick() {
    if (!this.isShowDropDown) {
      this.handleShowShowDropDown(true);
    }
    this.activeIndex = this.localValue.length - 1;
    this.isFocus = true;
  }

  /**
   * @description 输入框输入事件
   * @param event
   */
  handleInput(value) {
    this.inputValue = value;
  }
  /**
   * @description 输入框失去焦点事件
   */
  handleBlur() {
    this.inputValue = '';
    this.isFocus = false;
  }
  /**
   * @description 输入框enter事件
   */
  handleEnter() {
    if (this.hoverActiveIndex === -1) {
      this.handleShowShowDropDown(false);
      this.localValue.push({ id: this.inputValue, name: this.inputValue });
      this.activeIndex = this.localValue.length - 1;
      this.handleChange();
    }
    this.inputValue = '';
  }

  /**
   * @description 下拉展开与收起
   * @param v
   */
  handleShowShowDropDown(v: boolean) {
    this.isShowDropDown = v;
    if (this.isShowDropDown) {
      setTimeout(() => {
        onClickOutside(
          this.$el,
          () => {
            this.isShowDropDown = false;
          },
          { once: true }
        );
      }, 100);
    }
  }

  /**
   * @description 删除tag
   * @param index
   */
  handleDelete(index: number) {
    this.localValue.splice(index, 1);
    this.handleChange();
  }

  handleChange() {
    this.$emit('change', this.localValue);
  }
  handleTagUpdate(v: string, index: number) {
    this.localValue.splice(index, 1, { id: v, name: v });
  }

  render() {
    const inputRender = () => (
      <AutoWidthInput
        key={'input'}
        height={22}
        class='mb-4 mr-4'
        fontSize={12}
        isFocus={this.isFocus}
        value={this.inputValue}
        onBlur={this.handleBlur}
        onEnter={this.handleEnter}
        onInput={this.handleInput}
      />
    );
    return (
      <div class='retrieval__value-tag-selector-component'>
        <div
          class='value-tag-selector-component-wrap'
          onClick={this.handleClick}
        >
          {this.localValue.length
            ? this.localValue.map((item, index) => [
                <ValueTagInput
                  key={index}
                  class='value-tag-input'
                  value={item.id}
                  onChange={v => this.handleTagUpdate(v, index)}
                  onDelete={() => this.handleDelete(index)}
                />,
                this.activeIndex === index && inputRender(),
              ])
            : [
                inputRender(),
                !this.inputValue && (
                  <span
                    key={'no-data-placeholder'}
                    class='placeholder-span'
                  >{`${this.$t('请输入')} ${this.$t('或')} ${this.$t('选择')}`}</span>
                ),
              ]}
        </div>
        {this.isShowDropDown && (
          <div class='options-drop-down-wrap'>
            {!!this.inputValue && (
              <div
                key={'00'}
                class={['options-item', { 'active-index': this.hoverActiveIndex === -1 }]}
              >
                <i18n path='生成"{0}"Tag'>
                  <span class='highlight'>{this.inputValue}</span>
                </i18n>
              </div>
            )}
            {this.localOptions.map((item, index) => (
              <div
                key={index}
                class={['options-item', { 'active-index': this.hoverActiveIndex === index }]}
                onClick={e => {
                  e.stopPropagation();
                  this.handleCheck(item);
                }}
              >
                <TextHighlighter
                  content={item.name}
                  keyword={this.inputValue}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
