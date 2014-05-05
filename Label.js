(function(name, root){
	root = root || window;
	/*
	* label 操作和输入框的监听处理分开
	* label 2中处理方式：
	* 1 每次操作都是针对array，然后将array中的元素以标签形式append到dom中，实时性有问题
	* 2 直接操作dom
	*/
	var $ = function(id){
		return typeof id == 'string'? document.getElementById(id):id;
	};
	var browsersuport = {
		addEventListener: function(node, evName, callback){
			if(node.addEventListener){
				node.addEventListener(evName, callback, false);
			}else if(node.attachEvent){
				node.attachEvent("on" + evName, callback);
			}
		}
	};
	var Label_opt = (function(){
		var unLegalWords = ["aaa","bbb","ccc"],
			labels = [],
			id_prefix = "label_id";
		if(typeof Array.indexOf != 'function'){
			Array.prototype.indexOf = function(element){
				var index = -1;
				for(var i=0,len=this.length;i<len;i++){
					if(this[i] === element){
						index = i;
						break;
					}
				}
				return index;
			}
		}

		String.prototype.trim = function(){
			return this.replace(/(^\s*)|(\s*$)/g, '');
		};

		var isLegal = function(label){
			if(this.unLegalWords.indexOf(label) == -1){
				return true;
			}
			return false;
		};

		var wordsNotExists = isLegal;

		// 重复标签
		var labelExists = function(label){
			return labels.indexOf(label) != -1?true:false;
		};

		
		var addEvents = function(){
			var ul = $('label_list');
			// 事件代理，点击标签即删除，可以优化
			browsersuport.addEventListener(ul, 'click', function(e){
				// delete
				e = window.event || e;
				var target = e.target || e.srcElement,
					tagName = target.tagName.toLowerCase(),
					node = tagName == "a"?target.parentNode:target;
					$(node.id).style.display = 'none';
					var index = node.id.split(id_prefix)[1] - 1;
					labels.splice(index,1);
					
			});
			// 程序只执行一次
			addEvents = null;
		};

		// 添加标签
		var addLabel = function(label){
			label = label.trim();
			// 标签合理 && 无重复
			if(this.isLegal(label) && !labelExists(label)){
				labels.push(label);
				//dom
				if(labels.length == 1){
					// first add
					var label_list = '<li class="label" id="'+ (id_prefix + labels.length) +'"><a href="javascript:void(0);">' + label + '</a></li>',
						ul = document.createElement("ul");
					ul.id = 'label_list';
					ul.className = 'label_list';
					ul.innerHTML = label_list;
					document.body.appendChild(ul);
				}else{
					var ul = $("label_list"),
						li = document.createElement("li"),
						html = '<a href="javascript:void(0);">' + label + '</a>';
					li.className = "label";
					li.id = id_prefix + labels.length;
					li.innerHTML = html;
					ul.appendChild(li);
				}
				// 事件绑定
				if(typeof addEvents == 'function'){
					addEvents();
				}			
			}
			
		};

		// 添加敏感词
		var addUnLegalWords = function(words){
			if(wordsNotExists(words)){
				unLegalWords.push(words);
			}
		};

		return {
			// 添加标签
			add:addLabel
			// 敏感词，用于过滤标签
			,unLegalWords:unLegalWords
			// 用于检测标签合理性
			,isLegal:isLegal
			// 存放标签
			,labels:labels
		};
	})();

	root[name] = (function(){
		var init = function(cfg){
			Label_opt.unLegalWords = cfg.unLegalWords || [];
			var node = $(cfg.input);
			browsersuport.addEventListener(node, "keydown", function(e){
				e = window.event || e;
				if(e.keyCode == 32){
					Label_opt.add(node.value);
					node.value = "";
				}
			});
		}
		return {
			// 初始化配置及事件监听
			init: init
			// 获取最终的标签数组
			,getValues: function(){
				return Label_opt.labels;
			}
		}
	})();
})("Label", window);
