
class MapAlertMarker extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback () {
    const reason = this.getAttribute('reason') || '';
    const status = this.getAttribute('status') || '0';

    console.log('status' + status)

    const icon = status === "0" ? "images/img_tractor_top21.png" : "images/img_tractor_top11.png"


    const el = document.createElement('div');
    el.className = 'wrapper'
    el.innerHTML = `
    ${status === "0" ? `<div class="alert_title">
      <img src="images/icon_alarm.png" class="alert_img" />
      <p>${reason}</p>
    </div>`: ''}
    <img src="${icon}" class="car_img" />
    `;

    const style = document.createElement('style');
    style.textContent = `
            .wrapper {
              transform: translate(-50%, -50%);
            }
            p{
              margin:0;
              padding:0;
            }
            .alert_title {
              padding: 7rem 13rem;
              background: linear-gradient( 180deg, #FFF6F6 0%, #FFDCDC 100%);
              border-radius: 8rem;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14rem;
              color: #D84040;
              height: 39rem;
              box-sizing: border-box;
            }
            .alert_img {
              width: 26rem;
              height: 26rem;
              margin-right: 11rem;
            }
            .car_img {
              width: 100rem;
              height: 100rem;
            }
      `;
    this.attachShadow({ mode: 'open' }).append(style, el);
  }

}

customElements.define('map-alert-marker', MapAlertMarker);
