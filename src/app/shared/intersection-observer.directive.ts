import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
    standalone: true,
    selector: '[appIntersectionObserver]'
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {
    @Input() options: IntersectionObserverInit = {};
    @Output() visible = new EventEmitter<boolean>();

    private observer!: IntersectionObserver;

    constructor(private element: ElementRef) { }

    ngOnInit() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => this.visible.emit(entry.isIntersecting));
            },
            this.options
        );

        this.observer.observe(this.element.nativeElement);
    }

    ngOnDestroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}
