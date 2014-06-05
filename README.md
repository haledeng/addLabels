功能：
=========

空格添加多个标签，点击某个标签即删除该标签（操作待优化），同时提供了对敏感词的过滤。


API：
=========

    Label.init(cfg); // 提供配置，其中cfg的配置项包括：
                        unLegalWords：需要过滤的敏感词数组
                        input: 需要监听的input输入框ID
                        
    Label.getValues(); // 获取最终添加的标签，数组格式
