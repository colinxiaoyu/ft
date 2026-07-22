class AlarmCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this._alarmId = '';
    this._workStatus = '空闲';
    this._runStatus = '停车';
    this._drivemodetext = '自动驾驶';
    this._speed = '33km/h';
    this._icon = 'images/icon_alarm.png';
    this._data = '';
    this._currentindex = '0';
    this._fault = '';
    this._havejob = 'false'

    // 初始化视图分页相关的属性
    this.isSwiping = false;
    this.startX = 0;
    this.endX = 0;
    this.dots = [];
    this.contentWrapper = null;
  }

  static get observedAttributes () {
    return ['fault', 'alarm-id', 'runstatus', 'workstatus', 'speed', 'data', 'currentindex', 'havejob', 'drivemodetext'];
  }

  attributeChangedCallback (name, oldValue, newValue) {

    if (name === 'fault') {
      this._fault = newValue
    } else if (name === 'alarm-id') {
      this._alarmId = newValue;
    } else if (name === 'runstatus') {
      this._runStatus = newValue;
    } else if (name === 'drivemodetext') {
      this._drivemodetext = newValue;
    } else if (name === 'workstatus') {
      this._workStatus = newValue;
    } else if (name === 'speed') {
      this._speed = newValue;
    } else if (name === 'icon') {
      this._icon = newValue;
    } else if (name === 'data') {
      this._data = newValue;
      this.renderViewPager();
    } else if (name === 'currentindex') {
      this._currentindex = newValue;
      this.updateViewPagerIndex(newValue);
    } else if (name === 'havejob') {

      this._havejob = newValue;
    }
    this.render(); // 更新 UI
  }

  connectedCallback () {
    this.render();
  }

  render () {
    const style = document.createElement('style');
    style.textContent = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .container {
        border-radius: 16rem;
        background-color: #fff;
        overflow: hidden;
        box-shadow: 0 4rem 10rem rgba(0, 0, 0, 0.1);
      }

      .header {
        display: flex;
        background: linear-gradient(180deg, #FFF6F6 0%, #FFDCDC 100%);
        align-items: center;
        padding: 8rem 28rem;
        color: #D84040;
        transition: opacity 0.3s ease;
        font-weight: bold;
        font-size: 18rem;
        width: 350rem;

      }

      .alert_img {
        width: 33rem;
        height: 33rem;
      }

      .alert_img_text {
        margin-top: 8rem;
      }

      .header img {
        margin-right: 15rem;
      }

      .body {
        padding: 8rem 34rem;
      }
      .body-header{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 6rem;
      }

      .work-status{
        background: rgba(19, 206, 102, 0.1);
        border-radius: 16rem;
        font-weight: bold;
        font-size: 20rem;
        color: #13CE66;
        line-height: 38rem;
        text-align: center;
        padding:7rem 10rem;
      }

      .work-status-free{
        background: rgba(98,124,164,0.1);
        border-radius: 16rem;
        font-weight: bold;
        font-size: 20rem;
        color: #627CA4;
        line-height: 38rem;
        text-align: center;
        padding:7rem 10rem;
      }

      .id {
        font-weight: bold;
        font-size: 24rem;
        color: #333333;
      }

      .status-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .veh-status {
        width: 71rem;
        height: 38rem;
        background: rgba(19, 206, 102, 0.1);
        border-radius: 2rem;
        font-weight: bold;
        font-size: 20rem;
        color: #13CE66;
        line-height: 38rem;
        text-align: center;
      }

      .veh-status-free {
        width: 71rem;
        height: 38rem;
        background: rgba(98,124,164,0.1);
        border-radius: 2rem;
        font-weight: bold;
        font-size: 20rem;
        color: #333;
        line-height: 38rem;
        text-align: center;
      }

      .drivemode-text{
        width: 102rem;
        height: 38rem;
        background: rgba(19, 206, 102, 0.1);
        border-radius: 2rem;
        font-weight: bold;
        font-size: 20rem;
        color: #000;
        line-height: 38rem;
        text-align: center;
      }

      .speed {
        font-weight: bold;
        font-size: 22rem;
        color: #2D7EF8;
      }

      .viewpager-container {
        width: 350rem;
        box-sizing: border-box;
        margin: 0 auto;
      }

      /* Viewpager Styles */
      .viewpager {
        position: relative;
        width: 100%;
        max-width: 100vw;
        margin: 0 auto;
        overflow: hidden;
      }
      .viewpager-content {
        display: flex;
        transition: transform 0.3s ease-in-out;
      }
      .viewpager-item {
        flex: 0 0 100%;
        background: #F3F8FF;
        border-radius: 8rem 8rem 8rem 8rem;
        border: 2rem solid #FFFFFF;
        box-sizing: border-box;
        box-shadow: 0rem 4rem 8rem 0rem rgba(0,0,0,0.1);
      }
      .viewpager-dots {
        display: flex;
        justify-content: center;
        margin-top: 10rem;
      }
      .viewpager-dot {
        width: 6rem;
        height: 6rem;
        border-radius: 50%;
        margin: 0 3rem;
        background-color: #C8C8C8;
        cursor: pointer;
      }
      .viewpager-dot.active {
        background-color: #007bff;
      }
      .card-container {
        padding: 30rem 30rem 20rem;
        background-color: #F3F8FF;
        position: relative;
      }
      .destination {
        font-weight: bold;
        font-size: 22rem;
        color: #333333;
      }
      .remaining {
        font-size: 20rem;
        color: #999;
      }
      .distance, .time {
        color: #000;
      }
      .item-status {
        width: 120rem;
        background: linear-gradient(90deg, #72AAFF 0%, #2D7EF8 100%);
        box-shadow: 0rem 4rem 16rem 0rem rgba(45, 126, 248, 0.3);
        border-radius: 0rem 8rem 0rem 16rem;
        border: 2rem solid;
        font-weight: bold;
        font-size: 20rem;
        color: #FFFFFF;
        position: absolute;
        top: 0;
        right: 0;
        line-height: 36rem;
        text-align: center;
      }
    `;

    let content = '';
    if (this._fault !== '' && this.havejob === 'true') {
      content = `
        <div class="container">
          <div class="header">
            <img src="${this._icon}" alt="Alarm icon" class="alert_img"/>
            <p class="alert_img_text">${this._fault}</p>
          </div>
          <div class="body">
            <div class="body-header">
              <p class="id">${this._alarmId}</p>
              <p class=${this._workStatus === '空闲' ? "work-status-free" : "work-status"}>${this._workStatus}</p>
            </div>
            <div class="status-container">
              <div class=${this._runStatus === '停车' ? "veh-status-free" : "veh-status"} >·${this._runStatus}</div>
            <div class="drivemode-text" >${this._drivemodetext}</div>
              <div class="speed">${this._speed}</div>
            </div>
          </div>
          <div class="viewpager-container">
            <div class="viewpager">
              <div class="viewpager-content" id="viewpagerContent"></div>
              <div class="viewpager-dots" id="viewpagerDots"></div>
            </div>
          </div>
        </div>
      `;
    } else if (this._fault !== '' && this._havejob === 'false') {
      content = `
        <div class="container">
          <div class="header">
            <img src="${this._icon}" alt="Alarm icon" class="alert_img"/>
            <p class="alert_img_text">${this._fault}</p>
          </div>
        </div>
      `;
    } else if (this._fault === '' && this._havejob === 'true') {
      content = `<div class="container">
        <div class="body">
          <div class="body-header">
            <p class="id">${this._alarmId}</p>
            <p class=${this._workStatus === '空闲' ? "work-status-free" : "work-status"}>${this._workStatus}</p>
          </div>
          <div class="status-container">
            <div class=${this._runStatus === '停车' ? "veh-status-free" : "veh-status"} >·${this._runStatus}</div>
            <div class="drivemode-text" >${this._drivemodetext}</div>

            <div class="speed">${this._speed}</div>
          </div>
        </div>
        <div class="viewpager-container">
          <div class="viewpager">
            <div class="viewpager-content" id="viewpagerContent"></div>
            <div class="viewpager-dots" id="viewpagerDots"></div>
          </div>
        </div>
      </div>`
    }


    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(style);
    this.shadowRoot.innerHTML += content;
    if (this._havejob === 'true') {
      this.renderViewPager();
    }
  }


  getdDtaStatusBgColor (dataStatus) {
    switch (dataStatus) {
      case '已完成':
        return '#627CA4'
      case '未执行':
        return '#EC8526'
      default:
      case '执行中':
        return '#2D7EF8'
    }
  }

  renderViewPager () {
    if (this._havejob === 'false') {
      return
    }
    const viewpagerContent = this.shadowRoot.querySelector('#viewpagerContent');
    const viewpagerDots = this.shadowRoot.querySelector('#viewpagerDots');
    viewpagerContent.innerHTML = '';
    viewpagerDots.innerHTML = '';

    const data = JSON.parse(this._data);

    data.forEach((item, index) => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('viewpager-item');
      const dataStatusBgColor = this.getdDtaStatusBgColor(item.dataStatus)
      const normalStautsString = `${(item.status === 1 || item.status === 2) ? '剩余' : '全程'}<span class="distance">${item.dataDistance}</span> | <span class="time">${item.dataTime}</span>`
      const arriveStatusString = '即将到达'
      let finalStatusString = ''
      if ((item.status === 1 || item.status === 2) && item.dataDistance === '--') {
        finalStatusString = arriveStatusString
      } else {
        finalStatusString = normalStautsString
      }

      itemElement.innerHTML = `
        <div class="card-container">
          <p class="destination">目的站：${item.dataEndPoint}</p>
          <span class="remaining">
            ${finalStatusString}
          </span>
          <div class="item-status" style="background: ${dataStatusBgColor}">任务${item.dataStatus}</div>
        </div>`;
      viewpagerContent.appendChild(itemElement);

      const dot = document.createElement('div');
      dot.classList.add('viewpager-dot');
      dot.dataset.index = index;
      viewpagerDots.appendChild(dot);
    });

    this.dots = this.shadowRoot.querySelectorAll('.viewpager-dot');
    this.contentWrapper = viewpagerContent;
    this.goToPage(parseInt(this._currentindex, 10));
    this.addTouchEvents();
  }

  goToPage (index) {
    if (!this._data || this._data === '[]' || this._data === 'undefined') {
      return
    }
    const dataLength = JSON.parse(this._data).length;
    this._currentindex = Math.max(0, Math.min(index, dataLength - 1));

    this.contentWrapper.style.transform = `translateX(-${this._currentindex * 100}%)`;

    this.dots.forEach(dot => dot.classList.remove('active'));
    if (this.dots[this._currentindex]) {
      this.dots[this._currentindex].classList.add('active');
    }
  }

  addTouchEvents () {
    const viewpager = this.shadowRoot.querySelector('.viewpager');

    viewpager.addEventListener('touchstart', (event) => {
      this.startX = event.touches[0].pageX;
      this.isSwiping = true;
    });

    viewpager.addEventListener('touchmove', (event) => {
      if (!this.isSwiping) return;
      this.endX = event.touches[0].pageX;
    });

    viewpager.addEventListener('touchend', () => {
      if (!this.isSwiping) return;

      const deltaX = this.startX - this.endX;
      if (deltaX > 50) {
        this.goToPage(this._currentindex + 1);
      } else if (deltaX < -50) {
        this.goToPage(this._currentindex - 1);
      }

      this.isSwiping = false;
    });
  }

  updateViewPagerIndex (index) {
    this._currentindex = index;
    this.goToPage(index);
  }
}

customElements.define('alarm-card', AlarmCard);
