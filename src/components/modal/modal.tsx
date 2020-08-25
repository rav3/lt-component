import {Component, Prop, Watch, Event, EventEmitter, Method, Element, h, Listen} from '@stencil/core'

@Component({
    tag: 'lt-modal',
    styleUrl: 'modal.scss',
    shadow: true
})

export class Modal{
    
    modal: HTMLElement;
    panel: HTMLElement;

    isShowing = false;

    @Element() host: HTMLLtModalElement;
    
    @Prop() modaltitle = '';
    @Prop({ mutable: true, reflect: true }) open = false;

    @Watch('open')
        handleOpenChange() {
        this.open ? this.show() : this.hide();
    }

    @Event() modalHide: EventEmitter;
    @Event() modalAfterHide: EventEmitter;
    @Event() modalShow: EventEmitter;
    @Event() modalAfterShow: EventEmitter;
    @Event() modalOverlayDismiss: EventEmitter;

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
            const modalShow = this.modalShow.emit();
            if (modalShow.defaultPrevented) {
                this.open = false;
                return;
            }

            this.modal.hidden = false;
            this.host.clientWidth;
            this.isShowing = true;
            this.open = true;
    }

    @Method() 
        async hide(){
            if (!this.isShowing) {
                return;
            }
            const modalHide = this.modalHide.emit();
            if (modalHide.defaultPrevented) {
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
        this.modalOverlayDismiss.emit();
        this.hide();
    }
    handleTransitionEnd(event: TransitionEvent) {
        const target = event.target as HTMLElement;
    
        if (event.propertyName === 'transform' && target.classList.contains('modal__panel')) {
            this.open ? this.modalAfterShow.emit() : this.modalAfterHide.emit();
            this.modal.hidden = !this.open;
    
            if (this.open) {
                this.panel.focus();
            }
        }
    }
    
    render(){
        return(
            <div
                ref={el => (this.modal = el)}
                class={{
                    modal: true,
                    'modal--open': this.open,
                }}
                onKeyDown={this.handleKeyDown}
                onTransitionEnd={this.handleTransitionEnd}
                hidden
                >
                
                <div class="modal__overlay" onClick={this.handleOverlayClick} />
                <div 
                    ref={el => (this.panel = el)}
                    class="modal__panel"
                    role="dialog"
                    aria-modal="true"
                    aria-label={ this.modaltitle || null}
                    aria-hidden={!this.open}
                    tabIndex={0}
                >
                    <header part="header" class="modal__header">
                        <span part="title" class="modal__title">
                            {this.modaltitle}
                        </span>
                        <button class="modal__close" onClick={this.handleCloseClick}>✕</button>
                    </header>
                    
                    <div class="modal__body" part="body">
                        <slot name="body"/>
                    </div>
                </div>
            </div>
        )
    }
}
