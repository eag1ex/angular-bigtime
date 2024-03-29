
import { Component, Input, OnInit, ElementRef } from '@angular/core';


/**
 * we include image loader so we can display prealoader icon
 */
@Component({
  selector: 'image',
  template:`
    <div class="sk-circle img-preloader"   *ngIf='imageLoaded===false'>
      <div class="sk-circle1 sk-child"></div>
      <div class="sk-circle2 sk-child"></div>
      <div class="sk-circle3 sk-child"></div>
      <div class="sk-circle4 sk-child"></div>
      <div class="sk-circle5 sk-child"></div>
      <div class="sk-circle6 sk-child"></div>
      <div class="sk-circle7 sk-child"></div>
      <div class="sk-circle8 sk-child"></div>
      <div class="sk-circle9 sk-child"></div>
      <div class="sk-circle10 sk-child"></div>
      <div class="sk-circle11 sk-child"></div>
      <div class="sk-circle12 sk-child"></div>
  </div>      
    <img *ngIf='imageLoaded===true' class="card-img-top " [src]='src' [alt]="alt" [title]='title'>`
})
export class ImageDirective implements OnInit {

  imageLoaded: boolean = false;
  constructor(private elm: ElementRef) {
  }

  @Input()
  src: string;

  @Input()
  title: string;

  @Input()
  alt: string;

  ngAfterViewInit() {

  }

  ngOnInit() {
    var imgSrc = this.src;
    this.preloadImage(imgSrc)

  }

  preloadImage(src) {
    var tester = new Image();
    tester.src = src;
    tester.onload = () => {
      setTimeout(() => {
        this.imageLoaded = true;
      }, 100);
    }

    tester.onerror = () => {
      this.imageLoaded = false;
    }
  }

};

