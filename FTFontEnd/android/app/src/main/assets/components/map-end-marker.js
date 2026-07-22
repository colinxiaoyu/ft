
class MapEndMarker extends HTMLElement {
  constructor() {
    super();
    this.marker = null;
  }

  connectedCallback () {
    const icon = this.getAttribute('icon') || '';
    const title = this.getAttribute('title') || '站点B';
    const distance = this.getAttribute('distance') || '1';
    const costTime = this.getAttribute('costTime') || '0';


    const el = document.createElement('div');
    el.className = 'wrapper'
    el.innerHTML = `
          
              <div class="container">
                  <div class="container_left">终</div>
                  <div class="container_right">
                      <h4>${title}</h4>
                      <p>全程<span>${distance}</span>公里|<span>${costTime}</span>min</p>
                  </div>
              </div>
              <img src="${icon}" class="img" />
          
      `;

    const style = document.createElement('style');
    style.textContent = `
    .wrapper {
      transform: translate(-50%, -50%);
    }

    * {
      padding: 0;
      margin: 0;
    }

    .container {
      width: 248rem;
      background: #FFFFFF;
      border-radius: 11rem;
      display: flex;
    }

    .container_left {
      width: 52rem;
      background: rgba(255, 156, 64, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FF9C40;
      font-size: 22rem;
    }

    .container_right {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      padding: 6rem 12rem;
    }

    .container_right h4 {
      font-weight: bold;
      font-size: 22rem;
      color: #000000;
      line-height: 34rem;
    }

    .container_right p {
      font-weight: 500;
      font-size: 18rem;
      color: #666666;
      line-height: 34rem;
    }

    .container_right p span {
      color: #2D7EF8;
    }
    .img {
      width: 40rem;
      height: 40rem;
      margin-left: 100rem;
    }
      `;
    this.attachShadow({ mode: 'open' }).append(style, el);
  }
}

customElements.define('map-end-marker', MapEndMarker);
