import { Directive, Renderer2, ElementRef, Input, HostListener, Inject, Optional } from '@angular/core';
import { NG_VALUE_ACCESSOR, DefaultValueAccessor, COMPOSITION_BUFFER_MODE } from '@angular/forms';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'input[trim], textarea[trim]',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: InputTrimDirective, multi: true }]
})
export class InputTrimDirective extends DefaultValueAccessor {

  // tslint:disable-next-line: variable-name
  private _type: string = 'text';

  // Source services to modify elements.
  // tslint:disable-next-line: variable-name
  private _sourceRenderer: Renderer2;
  // tslint:disable-next-line: variable-name
  private _sourceElementRef: ElementRef;

  // Get a value of the trim attribute if it was set.
  @Input() trim: string;

  // Get the element type
  @Input()
  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value || 'text';
  }

  /**
   * Set a new value to the field and model.
   *
   */
  set value(val: any) {
    // update element
    this.writeValue(val);

    // update model
    this.onChange(val);

  }

  /**
   * Updates the value on the blur event.
   */
  @HostListener('blur', ['$event.type', '$event.target.value'])
  onBlur(event: string, value: string): void {
    this.updateValue(event, value);
  }

  /**
   * Updates the value on the input event.
   */
  @HostListener('input', ['$event.type', '$event.target.value'])
  onInput(event: string, value: string): void {
    this.updateValue(event, value);
  }

  constructor(
    @Inject(Renderer2) renderer: Renderer2,
    @Inject(ElementRef) elementRef: ElementRef,
    @Optional() @Inject(COMPOSITION_BUFFER_MODE) compositionMode: boolean) {
    super(renderer, elementRef, compositionMode);
    this._sourceRenderer = renderer;
    this._sourceElementRef = elementRef;
  }

  /**
   * Writes a new value to the element based on the type of input element.
   *
   * FIX: https://github.com/anein/angular2-trim-directive/issues/9
   *
   * @param {any} value - new value
   */
  public writeValue(value: any): void {

    if (value !== undefined) {
      this._sourceRenderer.setProperty(this._sourceElementRef.nativeElement, 'value', value);
    }

    // a dirty trick (or magic) goes here: it updates the element value if `setProperty` doesn't set it for some reason.
    if (this._type !== 'text') {
      this._sourceRenderer.setAttribute(this._sourceElementRef.nativeElement, 'value', value);
    }

  }

  /**
   * Trims an input value, and sets it to the model and element.
   *
   * @param {string} value - input value
   * @param {string} event - input event
   */
  private updateValue(event: string, value: string): void {

    // check if the user has set an optional attribute. Trimmmm!!! Uhahahaha!
    this.value = (this.trim !== '' && event !== this.trim) ? value : value.trim();

  }

}
