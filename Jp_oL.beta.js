var Jp_oL = (function(e, utils) {
	if (!e || e.length == 0) return;

	var config = { child: false, set: "or" }, selected = [], searchValue = "";

	init();

	function init() {
		let jarea = document.getElementById("jarea");
		if (jarea) {
			jarea.innerHTML = "";
		} else {
			jarea = document.createElement("div");
			jarea.id = "jarea";
			jarea.setAttribute("style", "z-index: " + (window.location.href.indexOf("/mindmap") > -1 ? "auto" : "999") + ";position: relative;");
			document.body.appendChild(jarea);
		}

		renderStyle(jarea);
		renderNav(jarea);

		function renderStyle(parent) {
			let style = document.createElement("style");
			style.innerHTML = "";
			style.innerHTML += "#jarea ::-webkit-scrollbar {width: 7px;height: 7px;}";
			style.innerHTML += "#jarea ::-webkit-scrollbar-thumb {border: 2px solid #fff;border-radius: 6px;background-color: #c6c6c6;}";
			style.innerHTML += "#jarea .jbtn {cursor: pointer;}";
			style.innerHTML += "#jnav .jbtn span {font-size: 35px;}";
			style.innerHTML += "#jnav .jhover {background: #f3f5f9;}";
			style.innerHTML += "#jheader {display: flex;justify-content: space-between;padding: 4px;}";
			style.innerHTML += "#jheader > div {display: flex;}";
			style.innerHTML += "#jheader .jbtn span {font-size: 20px;}";
			style.innerHTML += "#jbar {display: flex;justify-content: space-between;padding: 4px;}";
			style.innerHTML += "#jbar > div {display: flex;}";
			style.innerHTML += "#jbar > div:first-child > .jbtn {width: 50%;padding: 0 2px;}";
			style.innerHTML += "#jbar > div .jhover {color: #8ab17b;}";
			style.innerHTML += "#jbar > div .jactive {background: #f5fd79;}";
			style.innerHTML += "#jbar > div .jbtn span {font-size: 18px;}";
			style.innerHTML += "#jcontent > ul > li {padding: 8px 6px;}";
			parent.appendChild(style);
		}

		function renderNav(parent) {
			let jnav = document.getElementById("jnav");
			if (jnav) {
				jnav.innerHTML = "";
			} else {
				jnav = document.createElement("div");
				jnav.id = "jnav";
				jnav.setAttribute("style", "position: fixed;" 
											+ "left: 8px;" 
											+ "bottom: 80px;" 
											+ "padding: 6px;" 
											+ "background: #ffffff;" 
											+ "border-radius: 10%;" 
											+ "box-shadow: 0 2px 10px rgb(5 0 56 / 8%);");
				parent.appendChild(jnav);
			}

			for (let i = 0; i < e.length; i++) {
				let jbtn = document.createElement("div");
				jbtn.className = "jbtn";
				jbtn.onmouseover = function() {
					if (!this.classList.contains("jhover")) this.classList.add("jhover");
				};
				jbtn.onmouseout = function() {
					if (this.classList.contains("jhover")) this.classList.remove("jhover");
				};
				jbtn.onclick = function() {
					let jbox = e[i].event(renderBox, this, jarea);
					if (e[i].activeIcon) this.firstChild.innerHTML = jbox.style.display == "block" ? e[i].activeIcon : e[i].icon;
				};
				jnav.appendChild(jbtn);

				let span = document.createElement("span");
				span.innerHTML = e[i].icon;
				span.setAttribute("title", e[i].title);
				jbtn.appendChild(span);
			}
		}
	}

	function renderBox(m, r, _self, _top) {
		if (!m) return;

		let jbox = document.getElementById("jbox");
		if (jbox) {
			jbox.style.display == "none" ? jbox.style.display = "block" : jbox.style.display = "none";
			return jbox;
		} else {
			jbox = document.createElement("div");
			jbox.id = "jbox";
			jbox.setAttribute("style", "position: fixed;" 
										+ "left: 8px;" 
										+ "bottom: " + (80 + 10 + jnav.clientHeight) + "px;" 
										+ "display: block;" 
										+ "width: 300px;" 
										+ "height: 500px;" 
										+ "padding: 10px;" 
										+ "background: #ffffff;" 
										+ "border-radius: 2%;" 
										+ "box-shadow: 0 2px 10px rgb(5 0 56 / 8%);");
			_top.appendChild(jbox);
			
			readerHeader(jbox);
			renderHr(jbox);
			renderBar(jbox);
			renderContent(jbox);

			return jbox;
		}

		function readerHeader(parent) {
			let jheader = document.getElementById("jheader");
			if (jheader) {
				jheader.innerHTML = "";
			} else {
				jheader = document.createElement("div");
				jheader.id = "jheader";
				parent.appendChild(jheader);
			}

			renderLeft(jheader);
			renderRight(jheader);

			function renderLeft(parent) {
				let left = document.createElement("div");
				parent.appendChild(left);

				let reload = document.createElement("div");
				reload.className = "jbtn";
				reload.onclick = function() {
					renderContent(jbox, "reload");
				};
				left.appendChild(reload);

				let span = document.createElement("span");
				span.innerHTML = "🔄";
				span.setAttribute("title", "重置");
				reload.appendChild(span);
			}

			function renderRight(parent) {
				let right = document.createElement("div");
				parent.appendChild(right);

				let close = document.createElement("div");
				close.className = "jbtn";
				close.onclick = function() {
					_self.onclick();
				};
				right.appendChild(close);

				let span = document.createElement("span");
				span.innerHTML = "❌";
				span.setAttribute("title", "关闭");
				close.appendChild(span);
			}
		}

		function renderHr(parent) {
			let hr = document.createElement("hr");
			hr.setAttribute("style", "margin: 4px 0; padding 0;border-color: rgb(0 0 0 / 8%);");
			parent.appendChild(hr);
		}

		function renderBar(parent) {
			let jbar = document.getElementById("jbar");
			if (jbar) {
				jbar.innerHTML = "";
			} else {
				jbar = document.createElement("div");
				jbar.id = "jbar";
				parent.appendChild(jbar);
			}

			renderLeft(jbar);
			renderCenter(jbar);
			renderRight(jbar);

			function renderLeft(parent) {
				let left = document.createElement("div");
				left.setAttribute("style", "width: 14%;justify-content: left;");
				parent.appendChild(left);

				renderChild(left);
				renderSet(left);

				function renderChild(parent) {
					let child = document.createElement("div");
					child.className = "jbtn";
					child.onclick = function() {
						if (this.classList.contains("jactive")) {
							this.classList.remove("jactive");
							this.firstChild.setAttribute("title", "过滤子主题");
							config.child = false;
						} else {
							this.classList.add("jactive");
							this.firstChild.setAttribute("title", "保留子主题");
							config.child = true;
						}

						if (r) r(selected, config, utils);
					};
					parent.appendChild(child);

					let span = document.createElement("span");
					span.innerHTML = "ѱ";
					span.setAttribute("title", "过滤子主题");
					child.appendChild(span);
				}

				function renderSet(parent) {
					let set = document.createElement("div");
					set.className = "jbtn";
					set.onclick = function() {
						if (this.firstChild.getAttribute("data") == "or") {
							this.firstChild.innerHTML = "∩";
							this.firstChild.setAttribute("title", "交集");
							this.firstChild.setAttribute("data", "and");
							config.set = "and";
						} else if (this.firstChild.getAttribute("data") == "and") {
							this.firstChild.innerHTML = "∪";
							this.firstChild.setAttribute("title", "并集");
							this.firstChild.setAttribute("data", "or");
							config.set = "or";
						}

						if (r) r(selected, config, utils);
					};
					parent.appendChild(set);

					let span = document.createElement("span");
					span.innerHTML = "∪";
					span.setAttribute("title", "并集");
					span.setAttribute("data", "or");
					set.appendChild(span);
				}
			}

			function renderCenter(parent) {
				let center = document.createElement("div");
				center.setAttribute("style", "width: 58%;");
				parent.appendChild(center);

				let search = document.createElement("input");
				search.setAttribute("type", "text");
				search.setAttribute("placeholder", "输入查找内容");
				search.setAttribute("style", "width: 100%;padding: 2px;border: 1px solid #e9edf2;border-radius: 4px;");
				search.onkeydown = function(even) {
					if (even.keyCode == 13) {
						searchValue = this.value;
						renderContent(jbox, "search");
					}
				}
				center.appendChild(search);
			}

			function renderRight(parent) {
				let right = document.createElement("div");
				right.setAttribute("style", "width: 28%;justify-content: right;");
				parent.appendChild(right);

				render(right, [{
					icon: "全选",
					title: "全选",
					even: function() {
						renderContent(jbox, "all");
					}
				}, {
					icon: "反选",
					title: "反选",
					even: function() {
						renderContent(jbox, "reverse");
					}
				}]);

				function render(parent, e) {
					if (!e || e.length == 0) return;

					for (let i = 0; i < e.length; i++) {
						let jbtn = document.createElement("div");
						jbtn.className = "jbtn";
						jbtn.onmouseover = function() {
							if (!this.classList.contains("jhover")) this.classList.add("jhover");
						};
						jbtn.onmouseout = function() {
							if (this.classList.contains("jhover")) this.classList.remove("jhover");
						};
						jbtn.onclick = e[i].even;
						parent.appendChild(jbtn);

						let span = document.createElement("span");
						span.innerHTML = e[i].icon;
						span.setAttribute("title", e[i].title);
						jbtn.appendChild(span);
					}
				}
			}
		}

		function renderContent(parent, action) {
			let jcontent = document.getElementById("jcontent");
			if (jcontent) {
				jcontent.innerHTML = "";
			} else {
				jcontent = document.createElement("div");
				jcontent.id = "jcontent";
				jcontent.setAttribute("style", "height: 435px;padding: 4px;");
				parent.appendChild(jcontent);
			}

			if (m.code == 404) {
				renderMsg(jcontent, m.content);
			} else {
				let data = searchValue ? m.content.filter(function(o) {
					return o.tags.filter(function(oo) {
						return searchValue.split("|").findIndex(function(ooo) {
							return new RegExp(ooo, "g").test(oo.text);
						}) > -1;
					}).length > 0;
				}) : m.content;

				if (action) {
					if (action == "reload") {
						selected = [];
					} else if (action == "all") {
						selected = [];
						data.forEach(function(o) {
							o.tags.forEach(function(oo) {
								selected.push({ text: oo.text, color: oo.color, background: oo.background });
							});
						});
					} else if (action == "reverse") {
						let temp = [];
						data.forEach(function(o) {
							o.tags.forEach(function(oo) {
								if (selected.findIndex(function(ooo) {
									return ooo.text == oo.text 
											&& utils.colorCompare(ooo.color, oo.color) 
											&& utils.colorCompare(ooo.background, oo.background);
								}) == -1) temp.push({ text: oo.text, color: oo.color, background: oo.background });
							});
						});
						selected = temp;
					}

					if (r) r(selected, config, utils);
				}

				renderTags(jcontent, data);
			}

			function renderMsg(parent, msg) {
				let p = document.createElement("p");
				p.innerHTML = msg;
				p.setAttribute("style", "margin: 0; padding 0;text-align: center;font-size: 20px;color: #999;");
				parent.appendChild(p);
			}

			function renderTags(parent, data) {
				let ul = document.createElement("ul");
				ul.setAttribute("style", "height: 100%;overflow-y: scroll;");
				parent.appendChild(ul);

				for (let i = 0; i < data.length; i++) {
					let li = document.createElement("li");
					ul.appendChild(li);

					for (let j = 0; j < data[i].tags.length; j++) {
						let t = data[i].tags[j];

						let select = document.createElement("div");
						select.className = "jbtn";
						select.setAttribute("style", "display: inline-block;");
						select.onclick = function() {
							let text = this.lastChild.textContent;
							let color = this.lastChild.style.color;
							let background = this.lastChild.style.background;

							if (this.classList.contains("jselect")) {
								this.classList.remove("jselect");
								this.firstChild.innerHTML = "⚪";

								selected = selected.filter(function(o) {
									return !(o.text == text 
											&& utils.colorCompare(o.color, color) 
											&& utils.colorCompare(o.background, background));
								});
							} else {
								this.classList.add("jselect");
								this.firstChild.innerHTML = "🟢";

								if (selected.findIndex(function(o) {
									return o.text == text 
											&& utils.colorCompare(o.color, color) 
											&& utils.colorCompare(o.background, background);
								}) == -1) selected.push({ text: text, color: color, background: background });
							}

							if (r) r(selected, config, utils);
						};
						li.appendChild(select);

						let icon = document.createElement("span");
						if (selected.length > 0 && selected.findIndex(function(o) {
							return o.text == t.text 
									&& utils.colorCompare(o.color, t.color) 
									&& utils.colorCompare(o.background, t.background);
						}) > -1) {
							if (!select.classList.contains("jselect")) select.classList.add("jselect");
							icon.innerHTML = "🟢";
						} else {
							if (select.classList.contains("jselect")) select.classList.remove("jselect");
							icon.innerHTML = "⚪";
						}
						select.appendChild(icon);

						let span = document.createElement("span");
						span.innerHTML = t.text;
						span.setAttribute("style", "padding: 2px 4px;" 
													+ "margin: 2px 3px 0 0;" 
													+ "background: " + t.background + ";" 
													+ "font-size: 16px;" 
													+ "color: " + t.color + ";" 
													+ "line-height: 16px;" 
													+ "border-radius: 4px;");
						select.appendChild(span);
					}
				}
			}
		}
	}
}([{
	icon: "😳",
	activeIcon: "🙄",
	title: "筛选",
	event: function(render, _self, _top) {
		let mind = window.mind;
		if (!mind) return render({ code: 404, content: "没有找到数据！" }, null, _self, _top);

		let tags = [];
		for (let k in mind.model.topicList.data) {
			let ts = mind.model.topicList.data[k].tags;
			if (!ts || ts.length == 0) continue;
			tags = tags.concat(ts);
		}
		if (tags.length == 0) return render({ code: 404, content: "没有找到标签数据！" }, null, _self, _top);

		let data = [];
		for (let i = 0; i < tags.length; i++) {
			let t = tags[i];

			let item = data.find(function(o) { return o.text == t.text; });

			if (!item) data.push(item = { text: t.text, tags: [] });

			if (item.tags.findIndex(function(o) {
				return o.text == t.text && o.color == t.color && o.background == t.background;
			}) == -1) item.tags.push(t);
		}
		return render({ code: 200, content: data }, function(selected, config, utils) {
			let mind = window.mind;
			let root = mind.model.getTopicById("root");
			let copy = JSON.parse(JSON.stringify(root));

			if (selected && selected.length > 0) {
				if (copy.children && copy.children.length > 0) filter(copy.children);
				if (copy.leftChildren && copy.leftChildren.length > 0) filter(copy.leftChildren);
			}

			mind.currentRoot = copy;
			mind.currentRoot.root = !0;
			mind.operation.clearCanvas.call(mind);
			mind.initCanvas();
			mind.line.renderLineCon.call(mind);
			mind.renderTopic(copy);
			mind.plugins.navigator.init.call(mind);

			function filter(child) {
				config ? (config.child ? Cr_(config.set, child) : Cf_(config.set, child)) : Cf_("or", child);

				function Cr_(s, child) {
					for (let i = child.length - 1; i >= 0; i--) {
						let c = child[i];

						if (c.tags && c.tags.length > 0) {
							let count = 0;
							for (let j = 0; j < c.tags.length; j++) {
								for (let k = 0; k < selected.length; k++) {
									if (c.tags[j].text == selected[k].text 
										&& utils.colorCompare(c.tags[j].color, selected[k].color) 
										&& utils.colorCompare(c.tags[j].background, selected[k].background)
									) { count++; break; }
								}
							}
							if (s == "or") if (count > 0) continue;
							if (s == "and") if (count == selected.length) continue;
						}

						Cr_(s, c.children);

						if (!c.children || c.children.length == 0) child.splice(i, 1);
					}
				}

				function Cf_(s, child) {
					for (let i = child.length - 1; i >= 0; i--) {
						let c = child[i];

						if (c.children && c.children.length > 0) Cf_(s, c.children);

						if (!c.children || c.children.length == 0) {
							if (!c.tags || c.tags.length == 0) {
								child.splice(i, 1);
							} else {
								let count = 0;
								for (let j = 0; j < c.tags.length; j++) {
									for (let k = 0; k < selected.length; k++) {
										if (c.tags[j].text == selected[k].text 
											&& utils.colorCompare(c.tags[j].color, selected[k].color) 
											&& utils.colorCompare(c.tags[j].background, selected[k].background)
										) { count++; break; }
									}
								}
								if (s == "or") if (count == 0) child.splice(i, 1);
								if (s == "and") if (count != selected.length) child.splice(i, 1);
							}
						}
					}
				}
			}
		}, _self, _top);
	}
}], new function() {
	this.hexToRgb = function(v) {
		if (Object.prototype.toString.call(v) != "[object String]" || (v.length != 4 && v.length != 7)) return v;
		if (/^#[0-9a-fA-F]/g.test(v)) v = v.toLowerCase(); else return v;
		let a, b, c;
		if (v.length == 7) a = v.slice(1,3), b = v.slice(3,5), c = v.slice(5,7);
		if (v.length == 4) a = v.slice(1,2), b = v.slice(2,3), c = v.slice(3,4);
		if (!a || !b || !c) return v;
		if (v.length == 4) a = a + a, b = b + b, c = c + c;
		return "rgb(" + parseInt(a, 16) + "," + parseInt(b, 16) + "," + parseInt(c, 16) + ")";
	};

	this.colorCompare = function(a, b) {
		a = this.hexToRgb(a).split(",");
		b = this.hexToRgb(b).split(",");
		return a[0].trim().split("(")[1] == b[0].trim().split("(")[1] 
			&& a[1].trim() == b[1].trim() 
			&& a[2].trim().split(")")[0] == b[2].trim().split(")")[0];
	};

	this.equal = function(a, b, e) {
		if ((t = Object.prototype.toString.call(a)) != Object.prototype.toString.call(b)) return false;
		if (t != "[object Object]" && t != "[object Array]") return a == b;
		if (t == "[object Object]") return this.equalObj(a, b, e);
		if (t == "[object Array]") return this.equalArr(a, b, e);
	};

	this.equalObj = function(a, b, e) {
		if (Object.prototype.toString.call(a) != "[object Object]" 
			|| Object.prototype.toString.call(b) != "[object Object]") return false;
		let sa = (e ? Object.keys(a) : Object.getOwnPropertyNames(a)).sort();
		let sb = (e ? Object.keys(b) : Object.getOwnPropertyNames(b)).sort();
		if (sa.length != sb.length) return false;
		for (let i = 0; i < sa.length; i++) if (sa[i] != sb[i]) return false;
		for (let i = 0; i < sa.length; i++) if (!this.equal(a[sa[i]], b[sb[i]])) return false;
		return true;
	};

	this.equalArr = function(a, b, e) {
		if (Object.prototype.toString.call(a) != "[object Array]" 
			|| Object.prototype.toString.call(b) != "[object Array]") return false;
		if (a = a.sort(), b = b.sort(), a.length != b.length) return false;
		let ao = [], aa = [], bo = [], ba = [];
		for (let i = a.length - 1; i >= 0; i--) {
			let ta = Object.prototype.toString.call(a[i]), tb = Object.prototype.toString.call(b[i]);
			if (ta == "[object Object]") ao = ao.concat(a.splice(i, 1));
			if (ta == "[object Array]") aa = aa.concat(a.splice(i, 1));
			if (tb == "[object Object]") bo = bo.concat(b.splice(i, 1));
			if (tb == "[object Array]") ba = ba.concat(b.splice(i, 1));
		}
		if (a.length != b.length || ao.length != bo.length || aa.length != ba.length) return false;
		for (let i = 0; i < a.length; i++) if (!this.equal(a[i], b[i], e)) return false;
		for (let i = 0; i < ao.length; i++) {
			let f = false;
			for (let j = 0; j < bo.length; j++) if (f = this.equalObj(ao[i], bo[j], e)) break;
			if (!f) return false;
		}
		for (let i = 0; i < aa.length; i++) if (!this.equalArr(aa[i], ba[i], e)) return false;
		return true;
	};
}));