import {Component, Prop, Watch, Event, EventEmitter, Method, Element, h, Listen} from '@stencil/core'

@Component({
    tag: 'lt-drawer',
    styleUrl: 'drawer.scss',
    shadow: true
})

export class Drawer{
    
    drawer: HTMLElement;
    panel: HTMLElement;

    isShowing = false;

    @Element() host: HTMLLtDrawerElement;

    @Prop() position: 'top' | 'right' | 'bottom' | 'left' = 'right';
    @Prop({ mutable: true, reflect: true }) open = false;

    @Watch('open')
        handleOpenChange() {
        this.open ? this.show() : this.hide();
    }

    @Event() drawerHide: EventEmitter;
    @Event() drawerAfterHide: EventEmitter;
    @Event() drawerShow: EventEmitter;
    @Event() drawerAfterShow: EventEmitter;
    @Event() drawerOverlayDismiss: EventEmitter;

    connectedCallback() {
        this.handleCloseClick = this.handleCloseClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleOverlayClick = this.handleOverlayClick.bind(this);
        this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
    }

    @Method() 
        async show(){
            if (this.isShowing) {
                return;
            }
            const drawerShow = this.drawerShow.emit();
            if (drawerShow.defaultPrevented) {
                this.open = false;
                return;
            }

            this.drawer.hidden = false;
            this.isShowing = true;
            this.open = true;
    }

    @Method() 
        async hide(){
            if (!this.isShowing) {
                return;
            }
            const drawerHide = this.drawerHide.emit();
            if (drawerHide.defaultPrevented) {
                this.open = true;
                return;
            }
            
            this.isShowing = false;
            this.open = false;
    }

    componentDidLoad() {
        // Show on init if open
        if (this.open) {
            this.show();
        }
    }

    handleCloseClick() {
        this.hide();
    }

    @Listen('keydown')
    handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.hide();
        }
    }

    handleOverlayClick() {
        this.drawerOverlayDismiss.emit();
        this.hide();
    }
    handleTransitionEnd(event: TransitionEvent) {
        const target = event.target as HTMLElement;
    
        if (event.propertyName === 'transform' && target.classList.contains('drawer__panel')) {
            this.open ? this.drawerAfterShow.emit() : this.drawerAfterHide.emit();
            this.drawer.hidden = !this.open;
    
            if (this.open) {
                this.panel.focus();
            }
        }
    }
    
    render(){
        return(
            <div
                ref={el => (this.drawer = el)}
                class={{
                    drawer: true,
                    'drawer--open': this.open,
                    'drawer--top': this.position === 'top',
                    'drawer--right': this.position === 'right',
                    'drawer--bottom': this.position === 'bottom',
                    'drawer--left': this.position === 'left',
                }}
                onKeyDown={this.handleKeyDown}
                onTransitionEnd={this.handleTransitionEnd}
                hidden
                >
                
            
                <div class="drawer__overlay" onClick={this.handleOverlayClick} />
                <div 
                    ref={el => (this.panel = el)}
                    class="drawer__panel"
                    role="dialog"
                    aria-modal="true"
                    aria-hidden={!this.open}
                    tabIndex={0}
                >
                    <button class="drawer__close" onClick={this.handleCloseClick}>
                        <i class="fas fa-times"></i>
                    </button>
                    <slot />
                </div>
            </div>
        )
    }
}
