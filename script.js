

// 获取要应用滚动条效果的元素，比如 body
const scrollableElement = document.body;

let timer = null;
scrollableElement.addEventListener('scroll', () => {
  // 当滚动时，显示滚动条
  scrollableElement.style.overflow = 'scroll';

  // 如果已经有计时器在运行，清除它
  if (timer !== null) {
    clearTimeout(timer);
  }

  // 设置新的计时器
  timer = setTimeout(() => {
    // 当用户停止滚动一段时间后，隐藏滚动条
    scrollableElement.style.overflow = 'hidden';
  }, 1000); // 1000毫秒后执行，可以根据需要调整时间
});

// 生成音频
document.getElementById('playSoundIcon').addEventListener('click', function() {
    // 从<h1>元素获取文本而不是输入框
    var textToSpeak = document.getElementById('selected-text').textContent;

    // 如果文本为空，则不执行任何操作
    if (!textToSpeak.trim()) return;

    fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer  ' // 请替换成你的API密钥
        },
        body: JSON.stringify({
            model: "tts-1-hd",
            input: textToSpeak,
            voice: "echo"
        })
    })
    .then(response => response.blob())
    .then(blob => {
        var url = window.URL.createObjectURL(blob);
        var audioElement = document.getElementById('audioResult');
        audioElement.src = url;
        audioElement.play(); // 播放生成的音频
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('playSoundSvg').addEventListener('click', function() {
    document.getElementById('playSoundIcon').click();
});


// definition 

document.getElementById('generatedefinton').addEventListener('click', function() {
    var textToTranslate = document.getElementById('selected-text').textContent;

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '// 请替换成你的API密钥
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [
                {
                    "role": "system",
                    "content": "Explain this word simply and shortly for a 10-year-old."
                },
                {
                    "role": "user",
                    "content": textToTranslate
                }
            ],
            temperature: 0.7,
            max_tokens: 64,
            top_p: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        // 更新这里，将结果放入正确的元素中
        document.getElementById('translationResult').textContent = data.choices[0].message.content;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});


// sentence 
document.getElementById('generatesenten').addEventListener('click', function() {
    var textToTranslate = document.getElementById('selected-text').textContent;

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '  // 请替换成你的API密钥
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [
                {
                    "role": "system",
                    "content": "Create a sentence using this word. The sentence should be humorous and funny, and not too long"
                },
                {
                    "role": "user",
                    "content": textToTranslate
                }
            ],
            temperature: 0.7,
            max_tokens: 64,
            top_p: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        // 更新这里，将结果放入正确的元素中
        document.getElementById('sentenceResult').textContent = data.choices[0].message.content;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Chinese 
document.getElementById('makechinese').addEventListener('click', function() {
    var textToTranslate = document.getElementById('selected-text').textContent;

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '// 请替换成你的API密钥
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [
                {
                    "role": "system",
                    "content": "You will be provided with a sentence in English, and your task is to translate it into Chinese."
                },
                {
                    "role": "user",
                    "content": textToTranslate
                }
            ],
            temperature: 0.7,
            max_tokens: 64,
            top_p: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        // 更新这里，将结果放入正确的元素中
        document.getElementById('chineseResult').textContent = data.choices[0].message.content;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
document.addEventListener('DOMContentLoaded', function() {
    var params = new URLSearchParams(window.location.search);
    var text = params.get('text'); // 'text' 是我们通过 URL 传递的参数名
    if (text) {
        document.getElementById('selected-text').textContent = decodeURIComponent(text);  
    }
    document.getElementById('generatedefinton').click()
    document.getElementById('generatesenten').click()


});