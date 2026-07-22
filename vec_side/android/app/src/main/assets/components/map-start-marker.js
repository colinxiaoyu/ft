
class MapStartMarker extends HTMLElement {
  constructor() {
    super();
    this.marker = null;
  }

  connectedCallback () {
    const icon = this.getAttribute('icon') || '';
    const title = this.getAttribute('title') || '站点B';


    const el = document.createElement('div');
    el.className = 'wrapper'
    el.innerHTML = `
          <div>
              <div class="container">
                  <div class="container_left container_left_start">起</div>
                  <div class="container_right_start">
                      <h4>${title}</h4>
                  </div>
              </div>
              <img src="${icon}" class="img" />
          </div>
      `;

    const style = document.createElement('style');
    style.textContent = `
          * {
            padding: 0;
            margin: 0;
          }
          .wrapper {
            transform: translate(-50%, -50%);
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
            border-radius: 0rem 0rem 0rem 0rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FF9C40;
            font-size: 22rem;
          }
           .container_left_start {
              background-color: rgba(19, 206, 102, 0.12);
              color: #13CE66;
            }
          .container_right_start {
            display: flex;
            align-items: center;
            padding: 0 16rem;
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

customElements.define('map-start-marker', MapStartMarker);
