var Ji_iL = (function() {
	'use strict';

	const NODE_TYPE = { ELEMENT: 1, ATTRIBUTE: 2, TEXT: 3, NOTE: 8, DOCUMENT: 9 };

	const MD_CHARACTER = {
		LINE_BREAK: { SPACE: '  ', RETURN: '\n' },
		BOLD: { ASTERISK: '**', UNDERSCORE: '__' },
		ITALIC: { ASTERISK: '*', UNDERSCORE: '_' },
		UNDERLINED: { U_TAG: {START: '<u>', END: '</u>'} },
		STRIKETHROUGH: { TILDE: '~~' },
		UNORDERED_LIST: { HYPHEN: '-', PLUS_SIGN: '+', ASTERISK: '*' },
		CODE: { BACKTICK_QUOTES: '```' + '\n', TILDE: '~~~' + '\n' }
	};

	const CONFIG = {
		CATALOG: {
			STYLE: {
				_1: '风格一',
				_2: '风格二',
				_3: '风格三',
				_4: '风格四',
				_5: '风格五',
				_6: '风格六'
			},
			LINE_BREAK: {
				SPACE: '  ',
				RETURN: '\n'
			}
		},
		TITLE: {
			PATTERN: {
				_1: 'P{x} 📺 {xxx}',
				_2: '第 {x} 集：《{xxx}》'
			},
			LEVEL: {
				_1: '#',
				_2: '##',
				_3: '###',
				_4: '####',
				_5: '#####',
				_6: '######',
			}
		},
		NOTE: {
			ESCAPE_LEVEL: {
				ALL: 'all',
				RULE: 'rule',
				NONE: 'none'
			},
			ESCAPE_RULE: {
				// \
				BACKSLASH: {
					REGEXP: /\\/g,
					REPLACEMENT: '\\\\',
					IS_HEAD: false,
					IS_LOOP: false
				},
				// `
				BACKTICK: {
					REGEXP: /`/g,
					REPLACEMENT: '\\`',
					IS_HEAD: false,
					IS_LOOP: false
				},
				// *
				ASTERISK: {
					REGEXP: /\*/g,
					REPLACEMENT: '\\*',
					IS_HEAD: false,
					IS_LOOP: false
				},
				// _
				UNDERSCORE: {
					REGEXP: /_/g,
					REPLACEMENT: '\\_',
					IS_HEAD: false,
					IS_LOOP: false
				},
				/*
				// {
				CURLY_BRACE_LEFT: {
					REGEXP: /{/g,
					REPLACEMENT: '\\{',
					IS_HEAD: false,
					IS_LOOP: false
				},
				// }
				CURLY_BRACE_RIGHT: {
					REGEXP: /}/g,
					REPLACEMENT: '\\}',
					IS_HEAD: false,
					IS_LOOP: false
				},
				// (
				PARENTHESE_LEFT: {
					REGEXP: /\(/g,
					REPLACEMENT: '\\(',
					IS_HEAD: false,
					IS_LOOP: false
				},
				// )
				PARENTHESE_RIGHT: {
					REGEXP: /\)/g,
					REPLACEMENT: '\\)',
					IS_HEAD: false,
					IS_LOOP: false
				},
				*/
				// [
				SQUARE_BRACKET_LEFT: {
					REGEXP: /\[/g,
					REPLACEMENT: '\\[',
					IS_HEAD: false,
					IS_LOOP: false
				},
				// ]
				SQUARE_BRACKET_RIGHT: {
					REGEXP: /\]/g,
					REPLACEMENT: '\\]',
					IS_HEAD: false,
					IS_LOOP: false
				},
				// #
				HASK_MARK_TITLE: {
					REGEXP: /^(#{1,6} )/g,
					REPLACEMENT: '\\$1',
					IS_HEAD: true,
					IS_LOOP: false
				},
				HASK_MARK: {
					REGEXP: /(?<= +)(#[a-zA-Z\u4e00-\u9fa5])/g,
					REPLACEMENT: '\\$1',
					IS_HEAD: false,
					IS_LOOP: false
				},
				// +
				PLUS_SIGN: {
					REGEXP: /(?<=^ {0,3})\+ /g,
					REPLACEMENT: '\\+ ',
					IS_HEAD: true,
					IS_LOOP: false
				},
				// -
				HYPHEN: {
					REGEXP: /(?<=^ {0,3})- /g,
					REPLACEMENT: '\\- ',
					IS_HEAD: true,
					IS_LOOP: false
				},
				// .
				DOT: {
					REGEXP: /(?<=^ {0,3})(\d+)\. /g,
					REPLACEMENT: '$1\\\. ',
					IS_HEAD: true,
					IS_LOOP: false
				},
				// !
				EXCLAMATION_MARK: {
					REGEXP: /!\[/g,
					REPLACEMENT: '\\!\\[',
					IS_HEAD: false,
					IS_LOOP: false
				},
				// <
				ANGLE_BRACKET_LEFT: {
					REGEXP: /<([a-zA-Z]+)/g,
					REPLACEMENT: '\\<$1',
					IS_HEAD: false,
					IS_LOOP: false
				},
				// >
				ANGLE_BRACKET_RIGHT: {
					REGEXP: /(?<=^ {0,3})>/g,
					REPLACEMENT: '\\>',
					IS_HEAD: true,
					IS_LOOP: false
				},
				// ^
				CIRCUMFLEX: {
					REGEXP: /(?<= +)(\^[a-zA-Z0-9]+$)/g,
					REPLACEMENT: '\\$1',
					IS_HEAD: false,
					IS_LOOP: false
				},
				// ~
				TILDE_CODE: {
					REGEXP: /(?<=^ {0,3})(~~~)/g,
					REPLACEMENT: '\\$1',
					IS_HEAD: true,
					IS_LOOP: false
				},
				TILDE: {
					REGEXP: /(?<=[^\\])((~~)+)(?=[^ |~])/g,
					REPLACEMENT: '\\$1',
					IS_HEAD: false,
					IS_LOOP: true
				},
				// =
				EQUAL_SIGN_HEAD: {
					REGEXP: /(?<=^ {0,3})(=+)/g,
					REPLACEMENT: '\\$1',
					IS_HEAD: true,
					IS_LOOP: false
				},
				EQUAL_SIGN: {
					REGEXP: /(?<=[^\\])((==)+)(?=[^ |=])/g,
					REPLACEMENT: '\\$1',
					IS_HEAD: false,
					IS_LOOP: true
				},
				// $
				DOLLAR_SIGN: {
					REGEXP: /\$/g,
					REPLACEMENT: '\\$',
					IS_HEAD: false,
					IS_LOOP: false
				}
			}
		}
	}

	const DEFAULT_CONFIG = {
		IS_ONLY_CURR: false,
		CATALOG: {
			STYLE: CONFIG.CATALOG.STYLE._1,
			LINE_BREAK: CONFIG.CATALOG.LINE_BREAK.SPACE
		},
		TITLE: {
			PATTERN: CONFIG.TITLE.PATTERN._1,
			LEVEL: CONFIG.TITLE.LEVEL._2
		},
		NOTE: {
			ESCAPE_LEVEL: CONFIG.NOTE.ESCAPE_LEVEL.RULE,
			ESCAPE_STYLE: {
				LINE_BREAK: MD_CHARACTER.LINE_BREAK.RETURN,
				BOLD: MD_CHARACTER.BOLD.ASTERISK,
				ITALIC: MD_CHARACTER.ITALIC.ASTERISK,
				UNDERLINED: MD_CHARACTER.UNDERLINED.U_TAG,
				STRIKETHROUGH: MD_CHARACTER.STRIKETHROUGH.TILDE,
				LIST: MD_CHARACTER.UNORDERED_LIST.HYPHEN,
				CODE: MD_CHARACTER.CODE.BACKTICK_QUOTES
			}
		},
		IS_WIKI: false,
		IS_SEPARATE: false,
		IS_COMPRESSION: false
	};

	const API = {
		'/view': 'https://api.bilibili.com/x/web-interface/view',
		'/view/detail': 'https://api.bilibili.com/x/web-interface/view/detail'
	};

	var videoInfo = {};
	var setting = {};


	function isOpenBiliBili() {
		if (!window.location.href.includes('bilibili.com')) {
			alert("请进入B站后再重试");
			throw 'bilibili is not opened';
		}
	}

	function isOpenVideo() {
		let bvid = window.location.href.match(/(?<=bilibili.com\/video\/)(BV|av)[a-zA-Z0-9]+(?=[\/\?])?/g);
		return { isOpenVideo: bvid ? true : false, bvid: bvid ? bvid[0] : '' };
	}

	function isOpenNote(isOpenVideo, bvid, bv) {
		if (!isOpenVideo) return { isOpenNote: false, editor: null };
		if (bv && bv != bvid) return { isOpenNote: false, editor: null };
		//let editor = document.querySelector(".active-note");
		//editor = editor ? editor.querySelector(".ql-editor") : null;
		//let ion = editor && !editor.classList.contains("ql-blank");
		let editor = document.querySelector(".ql-editor");
		let ion = editor ? true : false;
		return { isOpenNote: ion, editor: editor };
	}

	function getVideoInfo(isOpenVideo, bvid, bv) {
		if(bv) {
			bvid = bv;
		} else {
			if (!isOpenVideo) {
				bvid = prompt("请输入视频的BV号：");
				if (bvid == null) throw 'close input';
				if (!bvid || !/^(BV|av)[a-zA-Z0-9]+$/g.test(bvid)) {
					alert("视频BV号输入有误，请重试");
					throw 'input invalid value';
				}
			}
		}

		let req = new Request(API['/view'], { bvid: bvid });
		let res = req.get();
		req.close();

		try {
			let data = JSON.parse(res).data;
			let isSeason = data.ugc_season ? true : false;
			let collection = isSeason ? document.querySelector('.first-line-left a') : null;
			let collectionUrl = collection ? collection.href : '';
			return {
				url: 'https://www.bilibili.com/video/' + bvid,
				bvid: data.bvid,
				aid: data.aid,
				pic: data.pic,
				title: data.title,
				desc: data.desc,
				ctime: new Date(data.ctime * 1000).toLocaleString(),
				pubdate: new Date(data.pubdate * 1000).toLocaleString(),
				name: data.owner.name,
				pages: data.pages,
				season: data.ugc_season,
				count: isSeason ? data.ugc_season.ep_count : data.videos,
				type: isSeason ? 3 : (data.videos > 1 ? 2 : 1),
				collectionUrl: collectionUrl
			};
		} catch(e) {
			alert("请求B站视频信息有误，请稍后重试");
			throw 'response parse error, e:' + e;
		}
	}

	function getOption(isOpenNote) {
		let selector = {
			'ioc': () => {
				return !confirm("【合集：共" + videoInfo.count + "个视频】是否下载全部？\n" 
								+ "确认：是（我全都要）\n" 
								+ "取消：否（只要当前或指定这个）");
			},
			'ikd': () => {
				return confirm("是否保持默认配置？\n" 
								+ "确认：是（跳过自定义配置）\n" 
								+ "取消：否（进入自定义配置）");
			},
			'cs': () => {
				return prompt("请选择想要更换的清单风格：\n" 
							+ "[风格一]：引用块包裹 + todo列表（默认）\n" 
							+ "[风格二]：引用块包裹 + 无序列表\n" 
							+ "[风格三]：引用块包裹\n" 
							+ "[风格四]：上下分割线包裹 + todo列表\n" 
							+ "[风格五]：上下分割线包裹 + 无序列表\n" 
							+ "[风格六]：上下分割线包裹", DEFAULT_CONFIG.CATALOG.STYLE);
			},
			'cbr': () => {
				let cbr = prompt("请选择清单中的换行方式：\n" 
								+ "[\\n]：空多一行\n" 
								+ "[  ]：两个空格（默认）", DEFAULT_CONFIG.CATALOG.LINE_BREAK);
				return typeof cbr == 'string' ? cbr.replace(/\\+n/g, "\n") : null;
			},
			'tp': () => {
				return prompt("请输入清单和笔记的分集标题模式：\n" 
							+ " 示例：第 {x} 集：《{xxx}》\n" 
							+ "  {x}：集数\n" 
							+ "{xxx}：分集标题", DEFAULT_CONFIG.TITLE.PATTERN);
			},
			'tl': () => {
				return prompt("请选择笔记的分集标题级别：\n" 
							+ "[#]：一级标题\n" 
							+ "[##]：二级标题（默认）\n" 
							+ "[###]：三级标题\n" 
							+ "[####]：四级标题\n" 
							+ "[#####]：五级标题\n" 
							+ "[######]：六级标题", DEFAULT_CONFIG.TITLE.LEVEL);
			},
			'nbr': () => {
				let nbr = prompt("请选择个人笔记的换行方式：\n" 
								+ "[\\n]：空多一行（默认）\n" 
								+ "[  ]：两个空格", "\\n");
				return typeof nbr == 'string' ? nbr.replace(/\\+n/g, "\n") : null;
			},
			'b': () => {
				return prompt("请选择个人笔记的加粗方式：\n" 
							+ "[**]：两个星号（默认）\n" 
							+ "[__]：两条下划线", DEFAULT_CONFIG.NOTE.ESCAPE_STYLE.BOLD);
			},
			'i': () => {
				return prompt("请选择个人笔记的斜体方式：\n" 
							+ "[*]：一个星号（默认）\n" 
							+ "[_]：一条下划线", DEFAULT_CONFIG.NOTE.ESCAPE_STYLE.ITALIC);
			},
			'li': () => {
				return prompt("请选择个人笔记的无序列表中小圆点的方式：\n" 
							+ "[-]：一个减号（默认）\n" 
							+ "[+]：一个加号\n" 
							+ "[*]：一个星号", DEFAULT_CONFIG.NOTE.ESCAPE_STYLE.LIST);
			},
			'code': () => {
				return prompt("请选择个人笔记的代码块方式：\n" 
							+ "[```]：三个反引号（默认）\n" 
							+ "[~~~]：三个波浪号", DEFAULT_CONFIG.NOTE.ESCAPE_STYLE.CODE);
			},
			'iw': () => {
				return confirm("是否使用 Wiki 链接？\n" 
								+ "确认：是（使用 [[文件名]]、![[图片名]] 形式）\n" 
								+ "取消：否（使用标准的 Markdown 语法）");
			},
			'is': () => {
				return confirm("【注意：共" + videoInfo.count + "个视频】是否分成多个笔记文件？\n" 
								+ "确认：是（一个清单文件 + n个笔记文件）\n" 
								+ "取消：否（清单 + 笔记将整合为一个文件）");
			},
			'ic': () => {
				return confirm("是否需要打包压缩？\n" 
								+ "确认：是\n" 
								+ "取消：否");
			}
		};

		let combinator = {
			'catalog': () => {
				return {
					style: selector['cs'](),
					lineBreak: selector['cbr']()
				};
			},
			'title': () => {
				return {
					pattern: selector['tp'](),
					level: selector['tl']()
				};
			},
			'note': () => {
				return {
					escapeStyle: {
						lineBreak: selector['nbr'](),
						bold: selector['b'](),
						italic: selector['i'](),
						list: selector['li'](),
						code: selector['code']()
					}
				};
			}
		}

		let page_combinator = {
			'single_page': () => {
				if (!isOpenNote) return {};

				if (selector['ikd']()) return {};

				return { note: combinator['note'](), isWiki: selector['iw']() };
			},
			'multi_page': () => {
				if (selector['ikd']()) return { isSeparate: selector['is']() };

				let obj = { catalog: combinator['catalog'](), title: combinator['title']() };
				if (isOpenNote) obj = { ...obj, ...{ note: combinator['note']() } };
				obj = { ...obj, ...{ isWiki: selector['iw']() } };
				return { ...obj, ...{ isSeparate: selector['is']() } };
			}
		}

		let option = null;

		if (videoInfo.type == 1) {
			option = page_combinator['single_page']();
		}

		if (videoInfo.type == 2) {
			option = page_combinator['multi_page']();
		}

		if (videoInfo.type == 3) {
			let ioc = selector['ioc']();

			if (ioc) {
				option = { ...{ isOnlyCurr: true }, ...page_combinator['single_page']() };
			} else {
				option = { ...{ isOnlyCurr: false }, ...page_combinator['multi_page']() };
			}
		}

		if (option) option = { ...option, ...{ isCompression: selector['ic']() } };

		return option;
	}

	function optionToSetting(option) {
		let setting = {};

		let str = JSON.stringify(DEFAULT_CONFIG);
		str = str.replace(/[{,]"[A-Z]+(_[A-Z]+)*"/g, function($0, $1) {
			return $0.toLowerCase().replace(/(?<=[a-z])_([a-z])/g, function($0, $1) {
				return $1.toUpperCase();
			});
		});
		let defaultConfig = JSON.parse(str);

		for (let k in defaultConfig) setting[k] = defaultConfig[k];

		if (option && typeof option == 'object') {
			let ioc = option.isOnlyCurr;
			if (typeof ioc == 'boolean') setting.isOnlyCurr = ioc;

			let catalog = option.catalog;
			if (catalog && typeof catalog == 'object') {
				for (let k in catalog) {
					if (typeof catalog[k] == 'string') setting.catalog[k] = catalog[k];
				}
			}

			let title = option.title;
			if (title && typeof title == 'object') {
				for (let k in title) {
					if (typeof title[k] == 'string') setting.title[k] = title[k];
				}
			}

			let note = option.note;
			if (note && typeof note == 'object') {
				let nel = note.escapeLevel;
				if (typeof nel == 'string') setting.note.escapeLevel = nel;

				let nes = note.escapeStyle;
				if (nes && typeof nes == 'object') {
					for (let k in nes) {
						if (typeof nes[k] == 'string') setting.note.escapeStyle[k] = nes[k];
					}
				}
			}

			let iw = option.isWiki;
			if (typeof iw == 'boolean') setting.isWiki = iw;

			let is = option.isSeparate;
			if (typeof is == 'boolean') setting.isSeparate = is;

			let ic = option.isCompression;
			if (typeof ic == 'boolean') setting.isCompression = ic;
		}

		setting.fileName = '笔记清单' + new Date().getTime();
		let f = videoInfo.type == 3 ? videoInfo.season.title : videoInfo.title;
		setting.folder = f ? f.replace(/[\\\/\:\*\?\"\<\>\|]/g, '') : '笔记';
		setting.attachment = '附件';

		return setting;
	}

	class Video {
		constructor(data, exNote) {
			this.data = data;
			this.exNote = exNote;
			this.catalog = '';
			this.note = '';
			this.files = [];
		}

		process() {
			console.log('subclass implement');
		}

		outLink(title) {
			let copy = title;
			let pattern = setting.isWiki ? '[[{link}|{display}]]' : '[{display}]({link})';
			let linkFix = setting.isSeparate ? '' : setting.fileName + '#';
			let link = '', display = '';

			let ascll = /[\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\{\[\}\]\|\\\:\;\"\'\<\,\>\.\?\/ ]/g;
			let encode = ($0) => { return !['(', ')'].includes($0) ? encodeURI($0) : ($0 == '(' ? '%28' : '%29'); }
			
			let wikiLinkReg = { r: /[\#\^\|\\]/g, $: ' ' };
			let wikiDisplayReg = { r: /(\[\])/g, $: ' $1' };
			let mdLinkReg = { r: ascll, $: encode };
			let mdDisplayReg = { r: /(\[\])/g, $: '\\$1' };

			if (setting.isSeparate) {
				let fileNameReg = { r: /[\#\^\[\]\|\*\"\\\/\<\>\:\?\~]/g, $: ' ' };
				title = title.replace(fileNameReg.r, fileNameReg.$);
				title = title.replace(/ +$/g, '');
				
				if (setting.isWiki) {
					link = linkFix + title.replace(wikiLinkReg.r, wikiLinkReg.$);
					display = copy.replace(wikiDisplayReg.r, wikiDisplayReg.$);
				} else {
					link = linkFix + title.replace(mdLinkReg.r, mdLinkReg.$);
					display = copy.replace(mdDisplayReg.r, mdDisplayReg.$);
				}
			} else {
				let titleReg = { r: /([\`\#\^\*\[\]\\\<\>])/g, $: '\\$1' };
				title = title.replace(titleReg.r, titleReg.$);

				if (setting.isWiki) {
					link = linkFix + title.replace(wikiLinkReg.r, wikiLinkReg.$);
					display = copy.replace(wikiDisplayReg.r, wikiDisplayReg.$);
				} else {
					link = linkFix + title.replace(mdLinkReg.r, mdLinkReg.$);
					display = title;
				}

				title = setting.title.level + ' ' + title;
			}

			let line = pattern.replace(/{link}/g, link).replace(/{display}/g, display);
			return { title: title, line: line };
		}

		separate(titles, notes) {
			if (setting.isSeparate) {
				titles.forEach((o, i) => {
					let content = o.hasOwnProperty('pic') ? 
									AssembleFactory("intro").format(o.pic, o.title, o.href) : 
									AssembleFactory("introNoImg").format(o.title, o.href);

					let index = notes.findIndex(function(t) { return t.index == i; });
					content += AssembleFactory("note").format(index > -1 ? notes[index].content : '');

					this.files.push({ fileName: o.content, content: content });
				});
			} else {
				let content = '';

				titles.forEach(function(o, i) {
					content += o.content + '\n\n';

					let index = notes.findIndex(function(t) {return t.index == i; });
					if (index > -1) content += notes[index].content + '\n';
				});

				this.files.push({ fileName: setting.fileName, content: content });
			}
		}

		assemble(pic, title, url) {
			console.log('subclass implement');
		}

		download() {
			let o = {
				compression: setting.isCompression,
				folder: setting.folder,
				attachment: setting.attachment
			};
			createAndDownloadFile(this.files, this.exNote.images(), o);
		}

		run() {
			this.process();
			this.download();
		}
	}

	class SingleVideo extends Video {
		constructor(data, exNote) {
			super(data, exNote);
		}

		process() {
			this.note = this.exNote.get();
			this.assemble(videoInfo.pic, videoInfo.title, videoInfo.url);
		}

		assemble(pic, title, url) {
			let intro = AssembleFactory("intro").format(pic, title, url);
			let note = AssembleFactory("note").format(this.note);
			let content = intro + note;

			this.files.push({ fileName: setting.fileName, content: content });
		}
	}

	class EpisodeVideo extends Video {
		constructor(data, exNote) {
			super(data, exNote);
		}

		process() {
			let parts = this.data.map(function(o) { return o.part; });
			let arr = parts.map(function(o) {
				return o.replace(/([\$\(\)\*\+\.\[\]\?\\\^\{\}\|])/g, '\\$1');
			});
			let reg = new RegExp(`(?<=[^\\\\])\\[(${arr.join("|")})`, "g");
			let slices = this.exNote.slice(reg);

			let catalog = new Catalog(setting.catalog.style, '视频选集');
			let titles = [], notes = [];
			this.data.forEach((o, i) => {
				let title = setting.title.pattern
								.replace(/{x}/g, o.page)
								.replace(/{xxx}/g, o.part);

				let href = videoInfo.url + '?p=' + o.page;

				let obj = this.outLink(title);
				
				catalog.push(obj.line + `[ ](${href})`);

				titles.push({ content: obj.title, title: o.part, href: href });

				if (slices.length > 0) {
					let temps = slices.filter(function(t) {
						let part = o.part.replace(/([\$\(\)\*\+\.\[\]\?\\\^\{\}\|])/g, '\\$1');
						return new RegExp(`\\[${part} P${o.page}`, "g").test(t);
					});
					if (temps.length > 0) notes.push({ content: temps.join(''), index: i });
				}
			});
			this.catalog = catalog.get();

			if (slices.length > 0 && !reg.test(slices[0])) this.note = slices[0] + "\n\n";

			this.separate(titles, notes);
			if (this.files.length == 1) this.note += this.files.pop().content + '\n';

			this.assemble(videoInfo.pic, videoInfo.title, videoInfo.url);
		}

		assemble(pic, title, url) {
			let tips = AssembleFactory("tips").format();
			let intro = AssembleFactory("intro").format(pic, title, url);
			let catalog = AssembleFactory("catalog").format(this.catalog);
			let note = AssembleFactory("note").format(this.note);
			let content = tips + intro + catalog + note;

			this.files.push({ fileName: setting.fileName, content: content });
		}
	}

	class SeasonVideo extends Video {
		constructor(data, exNote) {
			super(data, exNote);
		}

		process() {
			let exNote = this.exNote.get();

			if (setting.isOnlyCurr) {
				for (let i = 0; i < this.data.length; i++) {
					for (let ii = 0; ii < this.data[i].episodes.length; ii++) {
						let episode = this.data[i].episodes[ii];
						if (episode.bvid == videoInfo.bvid) {
							let href = 'https://www.bilibili.com/video/' + episode.bvid;
							let arr = [episode.arc.pic, episode.title, href];

							let intro = AssembleFactory("intro").format(...arr);
							let note = AssembleFactory("note").format(exNote);
							let content = intro + note;

							this.files.push({ fileName: setting.fileName, content: content });
						}
					}
				}
				return;
			}

			let catalog = new Catalog(setting.catalog.style, '视频合集');
			let titles = [], notes = [];
			let p = 1;
			this.data.forEach((o) => {
				o.episodes.forEach((oo) => {
					let title = setting.title.pattern
									.replace(/{x}/g, p++)
									.replace(/{xxx}/g, oo.title);

					let href = 'https://www.bilibili.com/video/' + oo.bvid;

					let obj = this.outLink(title);

					catalog.push(obj.line + `[ ](${href})`);

					titles.push({ content: obj.title, pic: oo.arc.pic, title: oo.title, href: href });

					if (exNote && videoInfo.bvid == oo.bvid) {
						notes.push({ content: exNote, index: p-2 });
					}
				});
			});
			this.catalog = catalog.get();

			this.separate(titles, notes);
			if (this.files.length == 1) this.note = this.files.pop().content + '\n';

			this.assemble(videoInfo.season.cover, videoInfo.season.title, videoInfo.collectionUrl);
		}

		assemble(pic, title, url) {
			let tips = AssembleFactory("tips").format();
			let intro = AssembleFactory("intro").format(pic, title, url);
			let catalog = AssembleFactory("catalog").format(this.catalog);
			let note = AssembleFactory("note").format(this.note);
			let content = tips + intro + catalog + note;

			this.files.push({ fileName: setting.fileName, content: content });
		}
	}

	function VideoFactory(type, exNote) {
		let selector = {
			1: () => { return new SingleVideo(null, exNote); },
			2: () => { return new EpisodeVideo(videoInfo.pages, exNote); },
			3: () => { return new SeasonVideo(videoInfo.season.sections, exNote); }
		}

		return selector[type]();
	}

	function AssembleFactory(part) {
		const ASSEMBLE_PATTERN = {
			TIPS: [
				'>[!warning] 警告！！！\n', 
				'>- 如果有出链，先查看出链面板下的数据是否识别成功\n', 
				'>- 打开“设置”-“选项”-“文件与链接”-“始终更新内部链接”功能\n', 
				'>- 确认后方可重新修改笔记名称\n',
				'>- 没有出链的可直接忽略以上步骤\n',
				'>- 确认笔记无误后可根据情况删除该警告\n', 
				'\n'
			],
			INTRO: [
				'![]({x})\n', 
				'\n', 
				'# {x}[ ]({x})\n', 
				'> **xxxxxx**\n', 
				'\n'
			],
			CATALOG: [
				'# 清单\n', 
				'\n', 
				'{x}', 
				'\n'
			],
			NOTE: [
				'# 笔记\n', 
				'\n', 
				'{x}', 
				'\n'
			],
			INTRO_NO_IMG: [
				'# {x}[ ]({x})\n', 
				'> **xxxxxx**\n', 
				'\n'
			]
		};

		function Assemble(pattern) {
			this.pattern = pattern.join('');

			this.format = (...args) => {
				let i = 0;
				return this.pattern.replace(/{x}/g, function() {
					return args[i++];
				});
			}
		}
		
		let selector = {
			'tips': () => { return new Assemble(ASSEMBLE_PATTERN.TIPS); },
			'intro': () => { return new Assemble(ASSEMBLE_PATTERN.INTRO); },
			'catalog': () => { return new Assemble(ASSEMBLE_PATTERN.CATALOG); },
			'note': () => { return new Assemble(ASSEMBLE_PATTERN.NOTE); },
			'introNoImg': () => { return new Assemble(ASSEMBLE_PATTERN.INTRO_NO_IMG); }
		}

		return selector[part]();
	}

	function Catalog(style, title) {
		this.style = style;
		this.title = title;
		this.first = '';
		this.prefix = '';
		this.br = !['  ', '\n'].includes(setting.catalog.lineBreak) ?
								DEFAULT_CONFIG.CATALOG.LINE_BREAK : 
										setting.catalog.lineBreak;
		this.suffix = '\n';
		this.last = '';
		this.output = '';

		this.push = (input) => {
			this.output += this.prefix + input;
			this.output += this.br == DEFAULT_CONFIG.CATALOG.LINE_BREAK ? 
							this.br : 
							(['风格一','风格二','风格三'].includes(this.style) ? '\n> ' : '\n');
			this.output += this.suffix;
		}

		this.get = () => {
			return this.first + this.output + this.last;
		}


		let selector = {
			'风格一': (title) => {
				this.first = '>[!info] **' + (!title ? '视频分集' : title) + '**\n';
				this.prefix = '> - [ ] ';
				this.last = '\n';
			},
			'风格二': (title) => {
				this.first = '>[!info] **' + (!title ? '视频分集' : title) + '**\n';
				this.prefix = '> - ';
				this.last = '\n';
			},
			'风格三': (title) => {
				this.first = '>[!info] **' + (!title ? '视频分集' : title) + '**\n';
				this.prefix = '> ';
				this.last = '\n';
			},
			'风格四': (title) => {
				this.first = '---\n';
				this.prefix = '- [ ] ';
				this.last = '---\n';
			},
			'风格五': (title) => {
				this.first = '---\n';
				this.prefix = '- ';
				this.last = '---\n';
			},
			'风格六': (title) => {
				this.first = '---\n';
				this.prefix = '';
				this.last = '---\n';
			}
		}

		function init(style, title) {
			selector[style](title);
		}

		init(this.style, this.title);
	}

	function ExNote(editor) {
		const EDITOR_ELEMENT = {
			BLOCK: {
				P: 'P',
				OL: 'OL',
				UL: 'UL',
				LI: 'LI',
				DIV: 'DIV',
				PRE: 'PRE'
			},
			INLINE: {
				BR: 'BR',
				B: 'B',
				STRONG: 'STRONG',
				I: 'I',
				EM: 'EM',
				U: 'U',
				S: 'S',
				SPAN: 'SPAN'	
			}
		};

		this.editor = editor;
		this.res = '';
		this.imgs = [];
		this.slices = [];

		this.raw = () => {
			return this.editor;
		}

		this.get = () => {
			return this.res;
		}

		this.images = () => {
			return this.imgs;
		}

		this.slice = (reg) => {
			if (!reg || this.res.length == 0) return this.slices;

			let lastIndex = 0;
			while (lastIndex > -1) {
				let result = reg.exec(this.res);
				if (result != null) {
					this.slices.push(this.res.slice(lastIndex, result.index));
					lastIndex = result.index;
				} else {
					this.slices.push(this.res.slice(lastIndex < 0 ? 0 : lastIndex));
					lastIndex = -1;
				}
			}

			return this.slices;
		}


		let init = () => {
			//if (!this.editor || this.editor.classList.contains("ql-blank")) return;
			if (!this.editor) return;

			if (!isVaildNode(editor)) return;

			let obj = parse(this.editor);
			this.res = obj.lines;
			this.imgs = obj.imgs;
		}

		init();


		function parse(editor) {
			let nodes = editor.childNodes;
			if (!nodes || nodes.length <= 0) return '';

			var lines = [];
			var imgs = [];

			for (let i = 0; i < nodes.length; i++) {
				let node = nodes[i];
				if (!isVaildNode(node)) continue;

				switch (node.nodeName) {
					case EDITOR_ELEMENT.BLOCK.P: 
						pToLine(node, lines);
						break;
					case EDITOR_ELEMENT.BLOCK.OL: 
						olToLine(node, lines);
						break;
					case EDITOR_ELEMENT.BLOCK.UL: 
						ulToLine(node, lines);
						break;
					case EDITOR_ELEMENT.BLOCK.DIV: 
						divToLine(node, lines, imgs);
						break;
					case EDITOR_ELEMENT.BLOCK.PRE: 
						preToLine(node, lines);
						break;
					default: 
						lines.push(node.textContent);
				}
			}

			return { lines: lines.join(setting.note.escapeStyle.lineBreak + "\n"), imgs: imgs };
		}

		function pToLine(node, lines) {
			lines.push(convert(node));
		}

		function olToLine(node, lines) {
			liToLine(node, lines, EDITOR_ELEMENT.BLOCK.OL);
		}

		function ulToLine(node, lines) {
			liToLine(node, lines, EDITOR_ELEMENT.BLOCK.UL);
		}

		function liToLine(node, lines, parent) {
			let nodes = node.childNodes;
			if (!nodes || nodes.length <= 0) return;

			let currLevel = 0;
			let levelIndex = {};
			
			for (let i = 0; i < nodes.length; i++) {
				let node = nodes[i];
				if (!isVaildNode(node)) continue;

				let className = node.getAttribute("class");
				if (!className) {
					currLevel = 0;
				} else {
					currLevel = className
								.match(/\bql-indent-[1-9]+\b/)[0]
								.match(/[1-9]+/)[0];
				}
				levelIndex[currLevel] || levelIndex[currLevel] == 0 ? 
				levelIndex[currLevel] += 1 : 
				levelIndex[currLevel] = 0;

				let character = "\t".repeat(currLevel);
				character += parent == EDITOR_ELEMENT.BLOCK.OL ? 
							(levelIndex[currLevel] + 1) + ". " : 
							setting.note.escapeStyle.list + " ";
				lines.push(character + convert(node));
			}
		}

		function divToLine(node, lines, imgs) {
			if (node.classList && node.classList.contains("ql-image-preview")) {
				let path = "path_" + imgs.length;
				let line = !setting.isWiki ? "![]({" + path + "})" : "![[{" + path + "}]]";
				lines.push(line);

				imgs.push(getImage(node));
			}
		}

		function preToLine(node, lines) {
			if (node.classList && node.classList.contains("ql-syntax")) {
				lines.push(format(node, setting.note.escapeStyle.code));
			} else {
				lines.push(node.textContent);
			}
		}

		function convert(node, isHead) {
			let nodes = node.childNodes;
			if (!nodes || nodes.length <= 0) return "";

			let block = "";
			
			for (var i = 0; i < nodes.length; i++) {
				let node = nodes[i];

				if (node.classList && node.classList.contains("ql-tag-blot")) {
					block += "[" + getTitle(node) + "](" + getUrl(node) + ")";
				} else {
					isHead = typeof isHead == 'boolean' ? isHead && i == 0 : i == 0;
					switch (node.nodeName) {
						case EDITOR_ELEMENT.INLINE.BR: 
							block += "";
							break;
						case EDITOR_ELEMENT.INLINE.B: 
						case EDITOR_ELEMENT.INLINE.STRONG: 
							block += format(node, 
											setting.note.escapeStyle.bold, 
											isHead);
							break;
						case EDITOR_ELEMENT.INLINE.I: 
						case EDITOR_ELEMENT.INLINE.EM: 
							block += format(node, 
											setting.note.escapeStyle.italic, 
											isHead);
							break;
						case EDITOR_ELEMENT.INLINE.U: 
							block += format(node, 
											setting.note.escapeStyle.underlined, 
											isHead);
							break;
						case EDITOR_ELEMENT.INLINE.S: 
							block += format(node, 
											setting.note.escapeStyle.strikethrough, 
											isHead);
							break;
						case EDITOR_ELEMENT.INLINE.SPAN: 
							block += format(node, 
											"", 
											isHead);
							break;
						default:
							block += format(node, 
											"", 
											isHead);
					}
				}
			}

			return block;
		}

		function format(node, character, isHead) {
			let content = "";
			if (isEnd(node)) {
				content = node.textContent;
				content = escape(content, isHead);
			} else {
				content = convert(node, isHead);
			}
			
			let s = typeof character == 'object' ? character.start : character;
			let e = typeof character == 'object' ? character.end : character;
			let bs = /^ +/.test(content) ? content.match(/^ +/)[0] : "";
			let ae = / +$/.test(content) ? content.match(/ +$/)[0] : "";
			let text = content.replace(/^ +/, "").replace(/ +$/, "");
			return bs + s + text + e + ae;
		}

		function escape(content, isHead) {
			if (typeof isHead != 'boolean') return content;

			for (let k in CONFIG.NOTE.ESCAPE_RULE) {
				let rule = CONFIG.NOTE.ESCAPE_RULE[k];
				
				if (!isHead && rule.IS_HEAD) continue;
				
				if (!rule.IS_LOOP) {
					content = content.replace(rule.REGEXP, rule.REPLACEMENT);
				} else {
					while (rule.REGEXP.test(content)) {
						content = content.replace(rule.REGEXP, rule.REPLACEMENT);
					}
				}
			}

			return content;
		}

		function getImage(node) {
			let img = node.querySelector("img");
			let src = img ? "https:" + img.getAttribute("src") : "";
			return src ? (src.includes("http") ? src : "https:" + src) : "";
		}

		function getTime(node) {
			let seconds = node.getAttribute("data-seconds");
			let h = parseInt(seconds / 60 /60 % 24);
			h = h < 10 ? '0' + h : h;
			let m = parseInt(seconds / 60 % 60);
			m = m < 10 ? '0' + m : m;
			let s = parseInt(seconds % 60);
			s = s < 10 ? '0' + s : s;
			return h == '00' ? m + ':' + s : h + ':' + m + ':' + s;
		}

		function getTitle(node) {
			let text = node.querySelector(".time-tag-item__text");
			let desc = node.querySelector(".time-tag-item__desc");
			return text.firstChild.textContent + (desc ? ' ' + desc.textContent : '');
		}

		function getUrl(node) {
			let index = node.getAttribute("data-index");
			let seconds = node.getAttribute("data-seconds");
			let url = videoInfo.url;
			return (index > 0 ? url + '?p=' + index : url) + '#t=' + seconds;
		}

		function isVaildNode(node) {
			return node.nodeType == NODE_TYPE.ELEMENT;
		}

		function isEnd(node) {
			return !node.children || node.children.length == 0;
		}
	}

	function Request(url, params) {
		this.url = url;
		this.params = params;
		this.xhr = Xhr();
		this.res;

		this.get = () => {
			open('get', this.url + parseParams());
			send(null);
			return this.res;
		}

		this.post = () => {
			return this.res;
		}

		this.close = () => {
			Xhr = null;
		}


		let parseParams = () => {
			if (!this.params) return '';

			if (typeof this.params != 'object') throw 'params is not object';

			let arr = [];
			for (let k in this.params) {
				let key = encodeURIComponent(k);
				let value = encodeURIComponent(this.params[k]);
				arr.push(key + '=' + value);
			}

			return '?' + arr.join('&');
		}

		let open = (method, url) => {
			this.xhr.open(method, url, false);
		}

		let send = (body) => {
			this.xhr.send(body);
			this.res = this.xhr.responseText;
		}
	}

	var Xhr = (function() {
		let instance = null;

		return function() {
			if (!instance) {
				let XHR = [
					function() { return new XMLHttpRequest() },
					function() { return new ActiveXObject("Msxml2.XMLHTTP") },
					function() { return new ActiveXObject("Msxml3.XMLHTTP") },
					function() { return new ActiveXObject("Microsoft.XMLHTTP") }
				];

				for (let i = 0; i < XHR.length; i++) {
					try {
						instance = XHR[i]();
					} catch(e) {
						continue;
					}
					break;
				}
			}

			return instance;
		}
	})();
	
	function createAndDownloadFile(notes, images, option) {
		if (!notes || !images) return;

		if (option && option.compression) {
			setTimeout(function() {
				compression(notes, images, option.folder, option.attachment);
			}, 500);
		} else {
			loopDownload(notes, images);
		}

		async function loopDownload(notes, images) {
			let sum = notes.length + images.length;
			let delay = Math.ceil(sum / 50) * 100;
			let count = 0;

			if (images && images.length > 0) {
				for (let i = 0; i < images.length; i++) {
					await getImage(images[i]).then(function(obj) {
						let fullname = obj.fileName + '.' + obj.suffix;
						
						let reg = new RegExp("{path_" + i + "}", "g");
						notes.forEach(function(o) {
							o.content = o.content.replace(reg, fullname);
						});

						setTimeout(function() {
							downloadFile(fullname, obj.content);
						}, count * delay);
						count++;
					}).catch(function(e) {
						console.error(e);
					});
				}
			}

			notes.forEach(function(o) {
				setTimeout(function() {
					downloadFile(o.fileName + '.md', o.content);
				}, count * delay);
				count++;
			});
		}

		async function compression(notes, images, folder, attachment) {
			try {
				let zip = new JSZip();

				let f = zip.folder(folder);

				if (images && images.length > 0) {
					let a = f.folder(attachment);

					for (let i = 0; i < images.length; i++) {
						await getImage(images[i]).then(function(obj) {
							let fullname = obj.fileName + '.' + obj.suffix;
							let path = attachment + '/' + fullname;
							
							let reg = new RegExp("{path_" + i + "}", "g");
							notes.forEach(function(o) {
								o.content = o.content.replace(reg, path);
							});

							a.file(fullname, obj.content);
						}).catch(function(e) {
							console.error(e);
						});
					}
				}

				notes.forEach(function(o) {
					f.file(o.fileName + '.md', o.content);
				});
				
				zip.generateAsync({ type: 'blob' }).then(function(content) {
					downloadFile('B站笔记' + new Date().getTime() + '.zip', content);
				});

				zip = null;
				let script = document.getElementById("jszip");
				if (script) document.head.removeChild(script);
			} catch(e) {
				console.error(e);
				alert("压缩文件失败，请重试或者选择不压缩");
			}
		}

		function getImage(src) {
			if (!src) return null;

			let credentials = src.includes('bilibili.com') ? 'include' : 'omit';

			return fetch(src, {
				method: 'get',
				credentials: credentials
			}).then(function(res) {
				if (res.status == 200) {
					let contentType = res.headers.get('Content-Type');
					
					if (contentType.includes('image/')) {
						return res.blob();
					}
				}
			}).then(function(blob) {
				let f = src.includes('?') ? 
						src.substring(src.lastIndexOf('=') + 1) : 
						src.substring(src.lastIndexOf('/') + 1, src.lastIndexOf('.'));
				let s = blob.type.substring(blob.type.indexOf('/') + 1);
				return { fileName: f, suffix: s, content: blob };
			});
		}

		function downloadFile(fileName, content) {
			let blob = new Blob([content]);
			let aTag = document.createElement('a');
			aTag.download = fileName;
			aTag.href = URL.createObjectURL(blob);
			aTag.click();
			URL.revokeObjectURL(blob);
		}
	}


	function BiliService(option, bv) {
		this.option = option;
		this.bv = bv;

		this.toNote = () => {
			isOpenBiliBili();

			let iov = isOpenVideo();

			let ion = isOpenNote(iov.isOpenVideo, iov.bvid, this.bv);

			videoInfo = getVideoInfo(iov.isOpenVideo, iov.bvid, this.bv);
			
			if (!this.option) this.option = getOption(ion.isOpenNote);

			setting = optionToSetting(this.option);

			VideoFactory(videoInfo.type, new ExNote(ion.editor)).run();
		}

		function init(option, bv) {
			if (option && typeof option != 'object') throw 'param option is not object';
			if (bv && typeof bv != 'string') throw 'param bv is not string';

			if (window.location.href.includes('bilibili.com')) {
				var script = document.createElement("script");
				script.id = "jszip";
				script.type = "text/javascript";
				script.src = "https://cdn.jsdelivr.net/gh/Stuk/jszip@main/dist/jszip.min.js";
				document.head.appendChild(script);
			}
		}

		init(this.option, this.bv);
	}

	return BiliService;
})();

/*
================================= 无特殊需求不用关注此部分说明 =====================================

一、使用说明

	1. 修改 option 中的各个 null 为具体值，可实现一次配置多次使用（保存好配置信息下次覆盖即可）

	2. 修改 BV 右边的 null 为某个视频BV号，可实现下载指定视频清单（仅下载清单和分集信息，个人笔记无法操作）

	3. 修改 Ji_iL(null, null) 中的两个 null 分别为 option 和 BV，只修改其中一个，另一个保持 null

	4. 在控制台内回车执行

二、修改示例

	1. 根据 三、参数说明 中的各项参数选择想要替换的符号并修改下列 option 中的值，不修改的保持 null
		var option = {
			isOnlyCurr: true,
			catalog: {
				style: "风格五",
				lineBreak: "\n"
			},
			title: {
				pattern: "第 {x} 集：《{xxx}》",
				level: "######"
			},
			note: {
				escapeStyle: {
					lineBreak: null,
					bold: "**",
					italic: null,
					list: null,
					code: "~~~"
				}
			},
			isWiki: true,
			isSeparate: true,
			isCompression: true
		};

	2. 根据个人需要，填入视频BV号
		var BV = "BV......7w6";

	3. 括号中填入 option 和 BV
		a. Ji_iL(null, null);     默认配置 + 当前视频
		b. Ji_iL(option, null);   自定义配置 + 当前视频
		c. Ji_iL(null, BV);       默认配置 + 指定视频
		d. Ji_iL(option, BV);     自定义配置 + 指定视频


三、参数说明

	1. option ：自定义配置

	-- isOnlyCurr    : 是否只下载当前一集，合集视频有效，选择下列两个选项中的其中一个
						true  ：是（只下载当前视频或指定视频）
						false ：否（下载当前视频或指定视频所在合集的全部视频）

	-- catalog ：清单相关

	---- style       : 可以更换分集清单的风格，选择下列六个选项中的其中一个
						"风格一" ：引用块包裹 + todo列表
						"风格二" ：引用块包裹 + 无序列表
						"风格三" ：引用块包裹
						"风格四" ：上下分割线包裹 + todo列表
						"风格五" ：上下分割线包裹 + 无序列表
						"风格六" ：上下分割线包裹

	---- lineBreak   : 清单中的换行方式，选择下列两个选项中的其中一个
						"\n" ：使用空白一行代表换行
						"  " ：使用两个空格代表换行

	-- title ：笔记标题相关

	---- pattern     : 可以自定义分集标题的展示格式，例如：
						"第 {x} 集：《{xxx}》" ===> 第 1 集：《哈哈哈》
													第 2 集：《呵呵呵》
													......
													第 n 集：《嘻嘻嘻》
						{x}   : 集数，花括号包着一个x，要求按此格式严格书写
						{xxx} : 分集标题，花括号包着三个x，要求按此格式严格书写

	---- lineBreak   : 个人笔记内容的换行方式，选择下列两个选项中的其中一个
						"\n" ：使用空白一行代表换行
						"  " ：使用两个空格代表换行

	-- note ：笔记内容相关

	---- bold        : 个人笔记内容的加粗方式，选择下列两个选项中的其中一个
						"**" ：使用星号代表加粗
						"__" ：使用下划线代表加粗

	---- italic      : 个人笔记内容的斜体方式，选择下列两个选项中的其中一个
						"*" ：使用星号代表斜体
						"_" ：使用下划线代表斜体

	---- list        : 个人笔记内容的无序列表方式，选择下列三个选项中的其中一个
						"-" ：使用减号（连字符）代表小圆点
						"+" ：使用加号代表小圆点
						"*" ：使用星号代表小圆点

	---- code        : 个人笔记内容的代码块方式，选择下列两个选项中的其中一个
						"```" ：使用三个反引号代表代码块
						"~~~" ：使用三个波浪号代表代码块

	-- isWiki        : 是否是否使用 Wiki 链接，选择下列两个选项中的其中一个
						true  ：是（使用 [[文件名]]、![[图片名]] 形式）
						false ：否（使用标准的 Markdown 语法）

	-- isSeparate    : 是否分开为多个笔记文件，多集视频有效，选择下列两个选项中的其中一个
						true  ：是（一个清单文件 + n个笔记文件）
						false ：否（清单 + 笔记将整合为一个文件）

	-- isCompression : 是否需要打包压缩，选择下列两个选项中的其中一个
						true  ：是
						false ：否

	2. BV ：指定视频BV号

	3. 有几点需要注意
		a. 建议不要使用敏感符号，否则容易语法冲突
		b. 除了 pattern 项外，其他选项中的符号皆为英文符号
		c. 除了 true 和 false，其他的值一定是有一对英文的双引号包括着

*/
// 默认 isOnlyCurr    ：false
// 默认 catalogStyle  ："风格一"
// 默认 lineBreak     ："  "
// 默认 titlePattern  ："P{x} 📺 {xxx}"
// 默认 lineBreak     ："\n"
// 默认 bold          ："**"
// 默认 italic        ："*"
// 默认 list          ："-"
// 默认 code          ："```"
// 默认 isWiki        ：false
// 默认 isSeparate    ：false
// 默认 isCompression : false
var option = {
	isOnlyCurr: null,
	catalog: {
		style: null,
		lineBreak: null
	},
	title: {
		pattern: null,
		level: null
	},
	note: {
		escapeStyle: {
			lineBreak: null,
			bold: null,
			italic: null,
			list: null,
			code: null
		}
	},
	isWiki: null,
	isSeparate: null,
	isCompression: null
};
var BV = null;

var bili = new Ji_iL(null, null);
bili.toNote();
bili = null;
