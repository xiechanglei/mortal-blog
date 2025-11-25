import styles from '/public/css/base.css' with {type: 'css'};

//定义一个简单的webcmponent作为header
class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.adoptedStyleSheets = [styles];
        this.shadowRoot.innerHTML = `
       <header class="header">
       <div class="container">
           <div class="header-content">
                <h1 class="site-title">Mortal's Blog</h1>
                <nav class="nav">
                    <div class="nav-left">
                        <slot />
                    </div>
                    <div class="nav-right">
                        <a href="https://github.com/xiechanglei/mortal-blog" target="_blank" class="nav-link">GitHub</a>
                        <a href="#" class="nav-link">关于</a>
                        <a href="#" class="nav-link">联系</a>
                        <a href="https://music.163.com/#/playlist?id=14231616354" class="nav-link">歌单</a>
                    </div>
                </nav>
            </div>
        </div>
        </header>
        `;
    }

}

customElements.define('global-header', HeaderComponent);