class DynamicViewPager extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.data = [
      { dataEndPoint: '站点A', dataDistance: '3.8', dataTime: '--', dataStatus: '行驶中', status: 1 },
    ];
    this.currentIndex = 0;  // 默认从第0页开始
    this.isSwiping = false;
    this.startX = 0;
    this.endX = 0;
    this.isFirstConnected = true;  // 用于标记第一次连接
  }

  static get observedAttributes () {
    return ['data', 'currentindex'];
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'data' && newValue) {
      this.data = JSON.parse(newValue);
      this.render();  // Re-render when data changes
    }

    if (name === 'currentindex' && newValue) {
      console.log('DynamicViewPager currentindex', newValue);
      const newIndex = parseInt(newValue, 10); // 用 `10` 为基数
      if (this.currentIndex !== newIndex) {
        this.currentIndex = newIndex;
        this.goToPage(this.currentIndex); // Go to the specific page
      }
    }
  }

  connectedCallback () {
    console.log('this.currentIndex', this.currentIndex);

    if (this.isFirstConnected) {
      // 只在第一次连接时处理一些初始化逻辑
      if (this.hasAttribute('data')) {
        this.data = JSON.parse(this.getAttribute('data'));
      }
      if (this.hasAttribute('currentindex')) {
        this.currentIndex = parseInt(this.getAttribute('currentindex'), 10);
      }
      this.isFirstConnected = false;  // 确保之后不再重复执行
    }

    this.render();
    this.addTouchEvents();
  }

  render () {
    // 清空 shadow DOM 内容，确保重新渲染
    this.shadowRoot.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = `
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
        padding: 20rem;
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
        color: #666666;
      }
      .distance, .time {
        color: #2D7EF8;
      }
      .status {
        width: 80rem;
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
    this.shadowRoot.appendChild(style);

    const viewpager = document.createElement('div');
    viewpager.classList.add('viewpager');
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('viewpager-content');

    // Add items dynamically based on `this.data`
    this.data.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('viewpager-item');
      itemElement.innerHTML =
        `<div class="card-container">
          <p class="destination">目的站：${item.dataEndPoint}</p>
          <span class="remaining">
            ${item.status === 1 ? '剩余' : '全程'}<span class="distance">${item.dataDistance}</span> | <span class="time">${item.dataTime}</span>
          </span>
          <div class="status">${item.dataStatus}</div>
        </div>`;
      contentWrapper.appendChild(itemElement);
    });

    viewpager.appendChild(contentWrapper);

    const dotsWrapper = document.createElement('div');
    dotsWrapper.classList.add('viewpager-dots');

    // Create dots based on the data length
    this.data.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('viewpager-dot');
      dot.dataset.index = index;
      dotsWrapper.appendChild(dot);
    });

    viewpager.appendChild(dotsWrapper);
    this.shadowRoot.appendChild(viewpager);

    this.dots = this.shadowRoot.querySelectorAll('.viewpager-dot');
    this.contentWrapper = contentWrapper;

    // Update the active dot
    this.goToPage(this.currentIndex);
  }

  goToPage (index) {
    // Move content based on the selected page
    this.contentWrapper.style.transform = `translateX(-${index * 100}%)`;

    // Update dots status
    this.dots.forEach(dot => dot.classList.remove('active'));
    if (this.dots[index]) {
      this.dots[index].classList.add('active');
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

    viewpager.addEventListener('touchend', (event) => {
      if (!this.isSwiping) return;

      const deltaX = this.startX - this.endX;
      if (deltaX > 50) {
        this.currentIndex = Math.min(this.currentIndex + 1, this.data.length - 1);
      } else if (deltaX < -50) {
        this.currentIndex = Math.max(this.currentIndex - 1, 0);
      }

      this.goToPage(this.currentIndex);
      this.isSwiping = false;
    });
  }
}

customElements.define('dynamic-viewpager', DynamicViewPager);
