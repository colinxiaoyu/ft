class MapCurrentMarker extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes () {
    return ['icon', 'heading'];
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (this.shadowRoot) {
      if (name === 'icon') {
        this.updateIcon(newValue);
      }
      if (name === 'heading') {
        this.updateHeading(newValue);
      }
    }
  }

  connectedCallback () {
    const icon = this.getAttribute('icon') || '';
    const heading = this.getAttribute('heading') || '0';


    // 创建 Shadow DOM 内容
    const el = document.createElement('div');
    el.className = 'wrapper';
    el.innerHTML = `<img src="${icon}" class="car_img" style="transform: rotate(${heading}deg);"/>`;

    const style = document.createElement('style');
    style.textContent = `
      .wrapper {
        transform: translate(-50%, -50%);
      }
      .car_img {
        width: 100rem;
        height: 100rem;
      }
    `;

    const shadow = this.attachShadow({ mode: 'open' });
    shadow.append(style, el);
  }

  updateIcon (icon) {
    const imgElement = this.shadowRoot.querySelector('.car_img');
    if (imgElement) {
      imgElement.src = icon;

    }
  }
  updateHeading (heading) {
    const imgElement = this.shadowRoot.querySelector('.car_img');
    if (imgElement) {
      const headingstyle = ` rotate(${heading}deg)`
      imgElement.style.transform = headingstyle
    }
  }
}

// 注册自定义元素
customElements.define('map-current-marker', MapCurrentMarker);
