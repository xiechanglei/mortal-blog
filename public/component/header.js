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
                        <a href="/index.html" class="nav-link site">首页</a>
                        <a href="/pages/about.html" class="nav-link site">关于</a>
                        <a href="https://github.com/xiechanglei/mortal-blog" target="_blank" class="nav-link">GitHub</a>
                        <a href="https://music.163.com/#/playlist?id=14231616354" target="_blank" class="nav-link">歌单</a>
                    </div>
                </nav>
            </div>
        </div>
        </header>
        `;

        // 站内的网页，需要对nav进行过滤，比如当前页面是about.html，那么nav中关于about的链接需要高亮显示，表示当前页面，点击无效
        const currentPath = window.location.pathname;
        const navLinks = this.shadowRoot.querySelectorAll('.nav-link.site');
        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            if (linkPath === currentPath || (currentPath + ".html") === linkPath) { // cloudflare pages会自动去掉.html后缀
                link.classList.add('active');
                link.removeAttribute('href'); // 移除链接，点击无效
            }
        });
    }

}

customElements.define('global-header', HeaderComponent);