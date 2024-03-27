// 常量
const ICON_SIZE = 32;
const POPUP_WIDTH = 346;
const POPUP_HEIGHT = 480;
const POPUP_BORDER_RADIUS = 32;
const Z_INDEX = 2147483647;

// 动画样式
const animationStyles = `
    @keyframes iconAppear {
        0% { transform: scale(0.6); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }
    .icon-appear {
        animation: iconAppear 350ms cubic-bezier(0.22, 0, 0, 1) forwards;
    }
    @keyframes slideDown {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    .iframe-appear {
        animation: slideDown 0.5s forwards;
    }
    @keyframes iconDisappear {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(0.6); opacity: 0; }
    }
    .icon-disappear {
        animation: iconDisappear 350ms cubic-bezier(0.22, 0, 0, 1) forwards;
    }
    @keyframes slideUp {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(20px); opacity: 0; }
    }
    .iframe-disappear {
        animation: slideUp 0.1s forwards;
    }
`;

// 确保动画样式只被添加一次
function ensureAnimationStyles() {
    if (!document.getElementById('my-extension-style')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'my-extension-style';
        styleSheet.type = 'text/css';
        styleSheet.innerText = animationStyles;
        document.head.appendChild(styleSheet);
    }
}

// 显示弹出的 iframe
function showPopup(x, y) {
    ensureAnimationStyles();

    const iframe = document.createElement('iframe');
    iframe.id = 'my-extension-iframe';
    iframe.className = 'iframe-appear';
    iframe.style.position = 'fixed';
    iframe.style.top = `${y}px`;
    iframe.style.left = `${x}px`;
    iframe.style.width = `${POPUP_WIDTH}px`;
    iframe.style.height = `${POPUP_HEIGHT}px`;
    iframe.style.borderRadius = `${POPUP_BORDER_RADIUS}px`;
    iframe.style.background = 'linear-gradient(#FFE3AD -50%, #FCFCFC 100%)';
    iframe.style.border = '2px solid white';
    iframe.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.4)';
    iframe.style.overflow = 'auto';
    iframe.style.zIndex = Z_INDEX;

    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    // 开始拖动
    iframe.addEventListener('mousedown', (event) => {
        isDragging = true;
        dragOffsetX = event.clientX - iframe.offsetLeft;
        dragOffsetY = event.clientY - iframe.offsetTop;
        event.preventDefault(); // 阻止默认行为
    });

    // 拖动过程
    window.addEventListener('mousemove', (event) => {
        if (isDragging) {
            iframe.style.left = `${event.clientX - dragOffsetX}px`;
            iframe.style.top = `${event.clientY - dragOffsetY}px`;
        }
    });

    // 结束拖动
    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
        }
    });

    const selectedText = encodeURIComponent(window.getSelection().toString().trim());
    iframe.src = chrome.runtime.getURL(`popup.html?text=${selectedText}`);

    document.body.appendChild(iframe);

    // 当用户点击 iframe 以外的区域时，隐藏 iframe 和图标
    const hideIframeAndIcon = (event) => {
        if (event.target !== iframe && event.target !== icon) {
            hidePopup();
            document.removeEventListener('mousedown', hideIframeAndIcon);
        }
    };
    document.addEventListener('mousedown', hideIframeAndIcon);
}

// 隐藏弹出的 iframe 和图标
function hidePopup() {
    const iframe = document.getElementById('my-extension-iframe');
    const icon = document.getElementById('my-extension-icon');

    if (iframe) {
        iframe.classList.remove('iframe-appear');
        iframe.classList.add('iframe-disappear');
        setTimeout(() => iframe.remove(), 300); // 300ms 是消失动画的持续时间
    }

    if (icon) {
        icon.classList.remove('icon-appear');
        icon.classList.add('icon-disappear');
        setTimeout(() => icon.remove(), 250); // 350ms 是消失动画的持续时间
    }
}

let icon; // 声明一个全局变量用于存储图标元素

// 事件监听器
document.addEventListener('mouseup', (event) => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
        ensureAnimationStyles();

        // 如果 icon 不存在，则重新创建图标
        if (!icon) {
            icon = document.createElement('img');
            icon.id = 'my-extension-icon';
            icon.className = 'icon-appear';
            icon.src = chrome.runtime.getURL('images/icon48.png');
            icon.style.position = 'fixed';
            icon.style.top = `${event.clientY - ICON_SIZE / 2 + 20}px`; // 假设向下偏移20像素
            icon.style.left = `${event.clientX - ICON_SIZE / 2 + 10}px`;
            icon.style.width = `${ICON_SIZE}px`;
            icon.style.height = `${ICON_SIZE}px`;
            icon.style.cursor = 'pointer';
            icon.style.zIndex = Z_INDEX;

            icon.addEventListener('click', () => {
                startIconDisappearAnimation();
                showPopup(event.clientX, event.clientY);
            });

            document.body.appendChild(icon);

            // 设置定时器，1.5 秒后启动消失动画并移除图标
            setTimeout(() => {
                startIconDisappearAnimation();
            }, 1000);
        }
    }
});

// 启动图标消失动画并移除图标
function startIconDisappearAnimation() {
    if (icon) {
        icon.classList.remove('icon-appear');
        icon.classList.add('icon-disappear');
        setTimeout(() => {
            icon.remove();
            icon = null; // 重置全局变量
        }, 350); // 350ms 是消失动画的持续时间
    }
}

// 隐藏弹出的 iframe 和图标
function hidePopup() {
    const iframe = document.getElementById('my-extension-iframe');
    if (iframe) {
        iframe.classList.remove('iframe-appear');
        iframe.classList.add('iframe-disappear');
        setTimeout(() => iframe.remove(), 300); // 300ms 是消失动画的持续时间
    }

    if (icon) {
        startIconDisappearAnimation(icon);
    }
}

// 当用户点击 iframe 以外的区域时，隐藏 iframe 和图标
const hideIframeAndIcon = (event) => {
    if (event.target !== iframe && event.target !== icon) {
        hidePopup();
        document.removeEventListener('mousedown', hideIframeAndIcon);
    }
};
document.addEventListener('mousedown', hideIframeAndIcon);