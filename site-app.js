
(function app(){
  'use strict';
  const db = window.EDITION;
  const main = document.querySelector('main');
  const header = document.getElementById('header');
  const footer = document.getElementById('footer');
  const sectionKeys = Object.keys(db.intro);
  const categories = Object.fromEntries(db.categories.map(x=>[x,x.replace(/^batch(\d+)$/,'Batch $1').replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())]));
  Object.assign(categories, {'ai':'AI','pmf':'PMF','b2b':'B2B','b2c':'B2C','saas':'SaaS','growth-2':'Growth','chinese-zh-tw':'中文','go-to-market':'Go-to-market'});
  let english=false, section='home', id='', args=new URLSearchParams();
  let referenceObservers=[];
  const local=(cn,en)=>english?en:cn;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const picture=(key,alt='',cls='')=>`<img class="${esc(cls)}" src="${esc(db.assets[key])}" alt="${esc(alt)}" decoding="async" loading="lazy">`;
  const url=(page,detail='',lang=english,query='')=>`#/${lang?'en':'zh'}/${encodeURIComponent(page)}${detail?'/'+encodeURIComponent(detail):''}${query?'?'+query:''}`;
  const link=(page,label,detail='',css='')=>`<a href="${url(page,detail)}" class="${css}"${section===page&&id===detail?' aria-current="page"':''}>${esc(label)}</a>`;
  const sectionName=key=>db.intro[key][english?1:0];
  const caption=key=>db.intro[key][english?3:2];
  const navName=key=>({home:local('概覽','Overview'),program:local('加速器計畫','Program'),collaborate:local('企業合作','Collaborate'),invest:local('投資機會','Invest'),career:local('加入我們','Careers'),core:'CORE Program',gtm:'CORE Workshop – GTM',hatcher:'Google Project Hatcher',blog:'Blog',news:local('媒體報導','News')})[key]||sectionName(key);
  const sectionBlock=(content,css='')=>`<section class="section ${css}"><div class="wrap">${content}</div></section>`;
  const heading=(text,side='')=>`<div class="section-head"><h2>${esc(text)}</h2>${side}</div>`;
  const actions=items=>`<div class="actions">${items.map(key=>link(key,navName(key),'','action')).join('')}</div>`;
  const chips=tags=>`<div class="chips">${tags.map(x=>`<span class="chip">${esc(x)}</span>`).join('')}</div>`;
  const catLink=tag=>link('category',categories[tag]||tag,tag,'chip');
  const showHero=(title,image)=>`<section class="hero ${image?'':'plain'}">${image?picture(image):''}<div class="wrap"><h1>${esc(title)}</h1></div></section>`;
  const back=(key,label)=>link(key,'← '+(label||navName(key)),'','backlink');
  const storyGrid=rows=>`<div class="summary-list">${rows.map(r=>`<div class="story"><h3>${esc(r[english?1:0])}</h3><p>${esc(r[english?3:2])}</p></div>`).join('')}</div>`;
  const row=(key,code,title,note='',tag='')=>`<a href="${url(key,code)}" class="row"><div>${tag?`<div class="label">${esc(tag)}</div>`:''}<h3>${esc(title)}</h3>${note?`<p>${esc(note)}</p>`:''}</div><span class="arrow" aria-hidden="true">→</span></a>`;
  const navTitle=label=>`<span class="d-89-menu-item-title-text">${esc(label)}</span><span class="d-89-title-underline" aria-hidden="true"></span>`;
  function navGroup(label,items,englishMenu) {
    const labels={home:englishMenu?'Overview':'概覽',people:englishMenu?'People':'團隊成員',program:englishMenu?'Program':'加速器計畫',gtm:'CORE Workshop - GTM',news:!englishMenu&&['home','people','member','mentor'].includes(section)?'媒體報導':'News'};
    const links=items.map(k=>k==='people'&&!englishMenu?'<a href="/team.html" class="dropdown_link w-inline-block">'+esc(labels[k])+'</a>':link(k,labels[k]||navName(k),'','dropdown_link w-inline-block')).join('');
    return `<details class="nav_dropd"><summary class="droplink"><span class="nav-label-wrap">${navTitle(label)}</span><span class="menu-chevron" aria-hidden="true"></span></summary><div class="dropdown_open">${links}</div></details>`;
  }
  function chrome() {
    const ownChrome=Boolean(window.accountPages?.[section] || window.legacyPages?.[section]);
    header.hidden=footer.hidden=ownChrome;
    if(ownChrome){header.replaceChildren();footer.replaceChildren();return}
    const englishMenu=english||['blog','post','category','news','story','job'].includes(section);
    const menuText=(zh,en)=>englishMenu?en:zh;
    const directTitles={portfolio:menuText('新創團隊','Portfolio'),collaborate:menuText('企業合作','Collaborate'),invest:menuText('投資機會','Invest'),career:menuText('加入我們','Career')};
    const languages=[true,false].map(isEnglish=>`<a class="dropdown-link-2 w-dropdown-link ${isEnglish===english?'w--current':'lang'}" ${isEnglish===english?'aria-current="true"':''} href="${url(section,id,isEnglish,args.toString())}" lang="${isEnglish?'en':'zh-Hant'}">${isEnglish?'EN':'CH'}</a>`).join('');
    header.dataset.banner=String((sectionKeys.includes(section)&&section!=='map')||section==='post');
    header.innerHTML=`<div class="reference-content chrome-ui"><div class="navbar-4 w-nav" data-collapse="medium">
      <div class="container_nav w-container">
        <a class="brand w-nav-brand" href="${url('home')}" aria-label="${local('首頁','Home')}">${picture('logo','SparkLabs Taiwan')}</a>
        <button class="menu-button-nb4 w-nav-button mobile-toggle" type="button" aria-label="${local('選單','Menu')}" aria-expanded="false" aria-controls="navigation"><span aria-hidden="true"></span></button>
        <nav id="navigation" class="container w-nav-menu" aria-label="${local('主選單','Main navigation')}">
          ${navGroup(menuText('關於我們','About'),['home','people','news','blog'],englishMenu)}
          ${navGroup(menuText('加速器','Accelerator'),['program','demoday'],englishMenu)}
          ${Object.entries(directTitles).map(([k,title])=>`<a href="${url(k)}" class="d-89-link-block w-inline-block"${section===k?' aria-current="page"':''}>${navTitle(title)}</a>`).join('')}
          ${navGroup(menuText('活動','Events'),['core','gtm','hatcher'],englishMenu)}
        </nav>
        <details class="language_btn w-dropdown"><summary class="dropdown-toggle w-dropdown-toggle" aria-label="${local('語言','Language')}">${local('CH','EN')}<span class="menu-chevron" aria-hidden="true"></span></summary><div class="dropdown-list-2 w-dropdown-list">${languages}</div></details>
      </div></div><button class="back2top" type="button" aria-label="${local('回到頁首','Back to top')}" hidden><span aria-hidden="true">↑</span></button></div>`;
    const enFooter=english||['core','gtm','blog','category','post','news','story','job'].includes(section);
    const field=(zh,en)=>enFooter?en:zh;
    const input=(zh,en)=>`<input class="newsletter_p w-input" type="text" maxlength="256" aria-label="${field(zh,en)}" placeholder="${field(zh,en)}">`;
    const social=[['Facebook','https://www.facebook.com/sparklabstaiwan'],['Instagram','https://www.instagram.com/sparklabs_taiwan/'],['LinkedIn','https://www.linkedin.com/company/sparklabs-taiwan/'],['Twitter','https://twitter.com/SparkLabsTaipei'],['YouTube','https://www.youtube.com/@SparkLabsTaiwan']];
    footer.innerHTML=`<div class="reference-content chrome-ui"><div class="footer"><div class="footer_newsletter">
      <div class="div-block-16">${picture('logo','SparkLabs Taiwan','image-5')}</div>
      <div class="newsletter"><h6 class="h7 h7_newsletter" id="newsletter-title">${field('訂閱我們的電子報','Join our newsletter')}</h6>
        <div class="w-form"><form class="newsletter_form footer-newsletter" autocomplete="off" aria-labelledby="newsletter-title" novalidate>
          <div class="footer_div_wapper"><div class="footer_email"><label for="newsletter-email" class="h7 footer_lab">${field('您的信箱','Email Address')}</label><input id="newsletter-email" type="email" maxlength="256" class="newsletter_p w-input" placeholder="your@email.com"></div>${input('您的姓名','Name')}</div>
          <div class="footer_div_wapper">${input('您的職稱','Job Title')}${input('您的公司','Company')}</div>
          <input type="submit" class="newsletter_btn w-button" value="${field('訂閱','Subscribe')}"><small role="status"></small>
        </form></div></div></div>
      <div class="footer_socialmedia"><div class="container_fix c_footer w-container"><div class="div-block-12"><a href="mailto:info@sparklabstaiwan.com" class="h7 h7_footer_info">info@sparklabstaiwan.com</a>${social.map(([name,href])=>`<a class="h7 h7_footer_link" href="${href}" target="_blank" rel="noopener noreferrer">${name}</a>`).join('')}</div><div class="h7 h7_copyright">©2022 SparkLabs Taiwan. All rights reserved.</div></div></div></div></div>`;
  }
  footer.addEventListener('submit',event=>{
    event.preventDefault();
    const form=event.target;
    form.reset();
    form.querySelector('[role="status"]').textContent=local('離線展示，未送出訂閱資料。','Offline preview. No subscription was sent.');
  });
  function milestones() {
    const template=document.createElement('template');
    const lang=english?'en':'zh';
    template.innerHTML=db.referenceLayouts?.[`${section}-${lang}`]||db.referenceLayouts?.[`invest-${lang}`]||'';
    const block=template.content.querySelector('.counter-container')?.closest('.hh_section-copy,.pg_section7,.iv_section');
    const anchor=section==='program'?' id="program-milestones" tabindex="-1"':'';
    if(block)return `<section class="reference-content"${anchor}>${block.outerHTML}</section>`;
    const labels=english?['Investments','Alumni Exits','Follow-on Investment Rate','Total $ Raised','Total Startup Valuation']:['投資加速之新創公司數','間新創校友成功出場','跟投率','衍生投資金額','總計估值'];
    const values=['70+','6','80%','$780M+','1.8B+'];
    return `<section${anchor}><h2>${local('里程碑','Milestones')}</h2><div class="metric-grid">${values.map((value,i)=>`<div class="metric"><b>${value}</b><span>${labels[i]}</span></div>`).join('')}</div></section>`;
  }
  function homePage(){
    const introduction=`<section class="overview-intro">
      ${[1,2,3].map(n=>picture('overview-shape-'+n,'','scene-shape shape-'+n)).join('')}
      <div class="overview-inner"><h2>${local('新創加速器暨創投基金','A Startup Accelerator & Venture Capital Fund')}</h2>
        <div class="overview-copy">
          <p>${local('SparkLabs Taiwan 是聚焦台灣的新創加速器暨創投基金，為國際團隊落地台灣的灘頭堡，同時為台灣數位轉型的催生者。採取「入選加速器計畫即投資」，協助新創公司拓展國際市場，募得後續投資。','SparkLabs Taiwan invests in early-stage companies with AI technology, industry applications and the ambition to grow internationally. Its accelerator helps overseas founders enter Taiwan and connects local enterprises with teams developing AI solutions.')}</p>
          <p>${local('SparkLabs Taiwan 是源自矽谷的 SparkLabs Group 新創加速器暨國際創投網絡的一員。自 2018 年年底成立至今，SparkLabs Taiwan 已投資並加速超過 60 間家新創團隊，包含 Just Kitchen（台灣最大雲端廚房）、ParseMe（創下台灣 B2B 企業解決方案新創最快出場紀錄）、Influenxio（微網紅行銷平台，獲矽谷知名創投 DCM Ventures 投資）等。','As part of the SparkLabs Group network, the Taiwan team invests in each company it admits. Founders can work with mentors, meet potential customers and prepare for their next round of funding through the same program.')}</p>
        </div>
        <div class="overview-copy overview-right"><h3>${local('從創業第一天就瞄準國際市場','Global from day one')}</h3><p>${local('台灣充滿經驗豐富的創新者、一流的技術資源與優秀的人才。然而，本地資源尚未完全準備好支持全球願景。','Taiwan has experienced founders and deep technical talent. Reaching customers elsewhere also takes local relationships and knowledge of each market.')}</p><p>${local('團隊在開發產品時就可以思考國際市場：哪些客戶也有同樣的問題？需要什麼樣的通路和合作夥伴，才能在當地提供服務？','The program asks founders to consider which problems travel across borders, who will buy the product and which partners can help take it to market.')}</p></div>
        <div class="overview-copy"><h3>${local('為早期新創提供三個月的加速器計畫','Three months of support for early-stage startups')}</h3><p>${local('創辦人與導師一對一討論產品和市場，接觸企業客戶，並在 DemoDay 向投資人發表團隊的進展。','Founders work one-to-one with mentors, meet potential business partners and present their progress to investors at DemoDay.')}</p>
          ${link('program',local('了解加速器計畫','Explore the accelerator program'),'','action')} ${link('people',local('團隊成員','Meet the team'),'','action')}</div>
      </div></section>`;
    return showHero(navName('home'),'home')+introduction+milestones()+
      sectionBlock(picture('overview-shape-4','','section-art')+heading(local('我們與企業的合作','Our work with corporate partners'),link('collaborate',local('探索合作機會','Explore partnerships'),'','action'))+storyGrid(db.sections.collaborate),'overview-lower')+
      sectionBlock(picture('overview-shape-5','','section-art')+heading(local('我們的辦公室位置','Our offices'))+
        `<div class="office-layout">${picture('taipei-office',local('台北 TTA 臺灣科技新創基地','Taiwan Tech Arena in Taipei'))}<div><h3>${local('台北','Taipei')}</h3><p>${local('TTA 臺灣科技新創基地','Taiwan Tech Arena')}</p><h3>${local('高雄','Kaohsiung')}</h3><p>${local('亞灣新創園','Startup Terrace Kaohsiung')}</p></div></div>`,'overview-lower')+
      sectionBlock(picture('overview-shape-6','','section-art')+heading(local('我們的全球網絡','Our global network'))+`<p class="lead">${local('SparkLabs Group 的基金與加速器網絡橫跨十多個國家，讓團隊在開拓海外市場時能接觸當地導師、企業與投資人。','The SparkLabs network spans more than ten countries. Its local mentors, companies and investors help founders establish themselves in new markets.')}</p>`,'overview-lower');
  }
  const personName=m=>m[english?2:1];
  function profileDirectorySource(){
    return window.directorySource.people[english?'en':'zh'];
  }
  function personCard(m){
    const key=m[0], record=profileDirectorySource().members[key];
    const [name,org,role]=record?.headings||[personName(m),m[3],m[english?5:4]];
    return `<a href="${url('member',key)}" class="person partners_item w-dyn-item ${key==='huangshanchun'?'draft':''}"><div class="partners_head_image">${picture('member-'+key,name,'photo')}</div><div class="div-block-_hover"><h3 class="h5 pp_h5 middle">${esc(name)}</h3><div class="h7 pp_h7 middle">${esc(org)}</div><div class="h7 pp_h7 middle _2">${esc(role)}</div></div></a>`;
  }
  function mentorCard(m){
    const [name,org,role]=profileDirectorySource().mentors[m[0]]?.headings||m.slice(1,4);
    return `<div class="gallery-list-item w-dyn-item"><a href="${url('mentor',m[0])}" class="person mentors_item_link w-inline-block"><div class="team_head_image">${picture(m[4],name,'photo')}</div><div class="div-block-_hover mentors_part"><h3 class="h6 pp_h6 black mentors_p">${esc(name)}</h3><div class="h7 pp_h7 middle small mentor_p">${esc(org||'')}</div><div class="h7 pp_h7 middle _2 small mentor_p">${esc(role||'')}</div></div></a></div>`;
  }
  function peoplePage(){
    const source=profileDirectorySource();
    const group=(title,rows,cls)=>`<div class="pp_section"><h2 class="h3 pg_h3">${esc(title)}</h2><div class="partners_wapper w-dyn-list"><div class="partners_list w-dyn-items ${cls}">${rows.map(personCard).join('')}</div></div></div>`;
    return `<div class="reference-content directory-people"><div class="pp_banner" style="background-image:url('${esc(db.assets.people)}')"><div class="container_fix w-container"><h1 class="h1 cp_h1 white">${sectionName('people')}</h1></div></div><div class="pg_section ab_1st"><div class="pp_bg_div tri-1"></div><div class="container_fix w-container"><h1 class="h1 ab_h1 black">${esc(source.introHeading)}</h1><div class="body2 pp_body2 _50"><br>${esc(source.introText)}</div></div></div>`+
      group(source.groups[0],db.members.slice(0,9),'partners')+group(source.groups[1],db.members.slice(9),'team-grid')+
      `<section class="pp_section" id="mentor-index"><div class="div_hight"><div class="column-wrapper"><h2 class="h3 pg_h3">${esc(source.groups[2])}</h2><div class="gallery-list-wrapper w-dyn-list"><label class="directory-sr">${local('搜尋導師','Find a mentor')}<input type="search" id="mentor-query" autocomplete="off"></label><div class="directory-sr" id="mentor-count" aria-live="polite"></div><div id="mentor-list" class="gallery-list w-dyn-items"></div><nav class="pages w-pagination-wrapper pagination_wrapper" id="mentor-pages" aria-label="${local('導師名錄分頁','Mentor directory pages')}"></nav></div></div></div></section></div>`;
  }
  function peopleSearch(){
    const field=document.getElementById('mentor-query'),pager=document.getElementById('mentor-pages');
    let page=Number.parseInt(args.get('mentors'),10)||1;field.value=args.get('q')||'';
    function update(){
      const q=field.value.toLocaleLowerCase().trim(),found=db.mentors.filter(m=>m.slice(1,4).join(' ').toLocaleLowerCase().includes(q));
      const count=Math.ceil(found.length/18);
      page=Math.min(Math.max(page,1),Math.max(1,count));
      document.getElementById('mentor-count').textContent=local(`${found.length} 位導師`,`${found.length} mentors`);
      document.getElementById('mentor-list').innerHTML=found.slice((page-1)*18,page*18).map(mentorCard).join('');
      pager.innerHTML=count>1?Array.from({length:count},(_,i)=>`<button data-page="${i+1}" ${page===i+1?'aria-current="page"':''}>${i+1}</button>`).join(''):'';
      if(section==='people'){
        const state=new URLSearchParams();if(args.get('part')==='mentors')state.set('part','mentors');if(q)state.set('q',field.value);if(page>1)state.set('mentors',page);
        const hash=url('people','',english,state.toString());
        if(location.hash!==hash)history.replaceState(null,'',hash);
        header.querySelector('.lang').href=url('people','',!english,state.toString());
      }
    }
    pager.addEventListener('click',e=>{const btn=e.target.closest('button[data-page]');if(btn){page=Number(btn.dataset.page);update();document.getElementById('mentor-index').scrollIntoView()}});
    field.addEventListener('input',()=>{page=1;update()});update();
  }
  function directMentorPage(mentor){
    const [key,name]=mentor;
    const image=mentor[4];
    const profile=profileDirectorySource().mentors[key];
    const index=db.mentors.indexOf(mentor),page=Math.floor(index/18)+1;
    const close=url('people','',english,(page>1?'mentors='+page+'&':'')+'part=mentors');
    const socials=profile.socials.map(([address])=>`<a class="p_social ${address.startsWith('mailto:')?'email':''} w-inline-block" target="_blank" rel="noopener noreferrer" href="${esc(address)}" aria-label="${address.startsWith('mailto:')?'Email':'LinkedIn'}"></a>`).join('');
    const neighbor=(person,cls)=>`<div class="${cls}">${person?`<a class="w-inline-block" href="${url('mentor',person[0])}" aria-label="${esc(person[1])}"><span class="heading-3">${esc(person[1])}</span></a>`:''}</div>`;
    return `<div class="reference-content directory-mentor-direct"><div class="mentor_pafe_wapper"><div class="container_fix w-container"><a class="gallery_modal_cls w-inline-block" href="${close}" aria-label="${local('返回導師名錄','Return to mentors')}"><span class="close-icon"></span></a><div class="partner_div_2"><div class="partners_slider_left_2">${picture(image,name,'partners_image')}<div class="partners_social_s">${socials}</div></div><div class="partners_slider_right_2"><h1 class="h3 pp_h3 black">${esc(profile.headings[0])}</h1><div class="h6 pp_h6 black">${esc(profile.headings[1])}</div><div class="h6 pp_h6 black">${esc(profile.headings[2])}</div><div class="po_line"></div><div class="parner_richtext w-richtext">${profile.html}</div><nav class="mentor_btn" aria-label="${local('其他導師','Other mentors')}">${neighbor(db.mentors[index-1],'mentor_pre')}${neighbor(db.mentors[index+1],'mentor_next')}</nav></div></div></div></div></div>`;
  }
  function openMemberDialog(member,mentor=null){
    const key=member[0];
    const website=db.memberWebsites?.[key];
    const source=profileDirectorySource()[mentor?'mentors':'members'][key];
    const [name,org,title]=source?.headings||[personName(member),member[3],member[english?5:4]];
    const social=(source?.socials||[]).map(([href])=>`<a class="profile-social" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${href.startsWith('mailto:')?'Email':'LinkedIn'}</a>`).join('');
    header.querySelector('.lang').href=url(mentor?'mentor':'member',key,!english);
    const paragraphs=member[english?7:6].split(/\n\s*\n/);
    const websiteLabel=local('更多經歷請見個人專頁','read more on his personal website');
    const websiteLink=website?`<a class="member-website" href="${esc(website)}" target="_blank" rel="noopener noreferrer">${websiteLabel}</a>`:'';
    const story=source?.html||paragraphs.map(paragraph=>{
      const formatted=esc(paragraph).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
      return `<p>${websiteLink?formatted.replace(websiteLabel,()=>websiteLink):formatted}</p>`;
    }).join('');
    const bioLang=english||member[6]===member[7]?'en':'zh-Hant';
    const dialog=document.createElement('dialog');
    dialog.className='member-dialog';
    dialog.dataset.member=key;
    dialog.dataset.type=mentor?'mentor':'member';
    dialog.setAttribute('aria-labelledby','member-name');
    dialog.innerHTML=`<div class="member-panel">
      <div class="directory-portrait-column">${picture(mentor?mentor[4]:'member-'+key,name,'member-portrait')}${social?'<div class="profile-socials">'+social+'</div>':''}</div>
      <div class="member-copy">
        <h1 id="member-name">${esc(name)}</h1>
        <p class="member-position">${esc(org)}<br>${esc(title)}</p>
        <button class="member-close" type="button" autofocus aria-label="${local('關閉人物介紹','Close profile')}"></button>
        <div class="member-story" tabindex="0" role="region" aria-label="${local('人物介紹','Biography')}">
          <div lang="${bioLang}">${story}</div>
          ${!paragraphs.some(p=>p.includes(websiteLabel))?websiteLink:''}
        </div>
      </div></div>`;
    function returnToPeople(){
      if(history.state?.memberOpener){history.back();return}
      history.replaceState(null,'',url('people'));
      render(true);
    }
    dialog.querySelector('.member-close').addEventListener('click',returnToPeople);
    dialog.addEventListener('cancel',event=>{event.preventDefault();returnToPeople()});
    main.append(dialog);
    dialog.showModal();
    document.title=name+' | SparkLabs Taiwan';
  }
  const facets=['industry','biz','batch'];
  function directoryCompanyLinks(links){
    const names={web:local('公司網站','Company website'),linkedin:'LinkedIn',video:local('觀看影片','Watch video')};
    return Object.entries(links).map(([kind,address])=>`<a class="po_icon ${kind} w-inline-block" href="${esc(address)}" target="_blank" rel="noopener noreferrer" aria-label="${names[kind]}" title="${names[kind]}"></a>`).join('');
  }
  function companyPage(){
    const c=db.companies.find(company=>company.key===id);
    if(!c)return missingPage();
    const source=window.directorySource.companies[c.key];
    const founders=source.founders.map(([name,role,linkedin])=>`<div class="team1_member"><h3 class="h5 pr_h5">${esc(name)}</h3><div class="body3 pr_body3">${esc(role)}</div>${linkedin?`<a class="po_icon linkedin team" href="${esc(linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"></a>`:''}</div>`).join('');
    const tags=Object.values(c.tags).flat().map(t=>`<span>${esc(t)}</span>`).join('');
    return `<article class="reference-content directory-company-dialog"><div class="directory-company-panel"><div class="fliter_modal_left">${picture('co-'+id,c.name,'fliter_img_logo')}<div class="fliter_team_box">${founders}</div></div><div class="fliter_modal_right"><h1 class="h3 pr_h3 black">${esc(c.name)}</h1><div class="fliter_modal_tag_warp">${tags}</div><div class="fliter_team_box-mobile">${founders}</div><div class="po_line"></div><div class="fliter_modal_rich w-richtext" tabindex="0">${source[english?'en':'zh'].paragraphs.map(t=>`<p>${esc(t)}</p>`).join('')}</div><div class="po_line"></div><div class="po_icon_block">${directoryCompanyLinks(source.links)}</div></div></div></article>`;
  }
  function companyCard(company){
    const data=window.directorySource.companies[company.key];
    return `<div role="listitem" class="fliter_card w-dyn-item"><div class="fliter_card_b"><a class="company directory-company-open" href="${url('company',company.key)}" aria-label="${esc(company.name)}"></a><div class="tag_1_high">${data.industry?`<div class="tag_1">${esc(data.industry)}</div>`:''}</div><div class="fliter_card_img_wap">${picture('co-'+company.key,company.name,'fliter_card_img')}</div><div class="po_line"></div><div class="po_text_box"><h2 class="h6 po_h6 black">${esc(company.name)}</h2><div class="body3 po_body3 black">${esc(data[english?'en':'zh'].summary)}</div></div><div class="po_line"></div><div class="po_tag_block">${data.tagline.map(t=>`<div>${esc(t)}</div>`).join('')}</div><div class="po_icon_block">${directoryCompanyLinks(data.links)}</div></div></div>`;
  }
  function portfolioPage(){
    return `<div class="reference-content directory-portfolio"><div class="cpo_hero" style="background-image:url('${esc(db.assets.portfolio)}')"><div class="container_fix w-container"><h1 class="h1 cp_h1 white">${sectionName('portfolio')}</h1></div></div><div class="pr_section"><div><div class="po_stick_menu w-form"><div class="form">${window.directorySource.sidebar}<div class="po_fliter_wapper w-dyn-list"><div id="companies" class="collection-list-5 w-dyn-items" role="list"></div><div id="results-count" class="directory-status" aria-live="polite"></div><nav id="pages" class="w-pagination-wrapper pagination_wrapper" aria-label="${local('名錄分頁','Directory pages')}"></nav></div></div></div></div></div></div>`;
  }
  function filterCompanies(){
    const shell=main.querySelector('.directory-portfolio');
    const fields=[...shell.querySelectorAll('input[data-facet]')], tabs=[...shell.querySelectorAll('[data-directory-tab]')];
    const reset=shell.querySelector('[fs-cmsfilter-element=reset]');
    let page=Number.parseInt(args.get('page'),10)||1;
    let search=(args.get('q')||'').toLowerCase().trim();
    const normalize=value=>value.toLowerCase().replace(/[\s#]/g,'');
    fields.forEach(input=>{input.checked=args.getAll(input.dataset.facet).some(tag=>normalize(tag)===normalize(input.value))});
    if(english){
      shell.querySelector('.po_title h1').textContent='Filter by';
      reset.querySelector('div').textContent='Reset All';
      tabs.forEach((tab,i)=>{tab.querySelector('div').textContent=['Industry','Business Model','Batch #'][i]});
    }
    function selectTab(index){
      tabs.forEach((tab,i)=>{
        tab.classList.toggle('w--current',i===index);
        tab.setAttribute('aria-selected',String(i===index));
        tab.tabIndex=i===index?0:-1;
        document.getElementById(tab.getAttribute('aria-controls')).classList.toggle('w--tab-active',i===index);
      });
    }
    tabs.forEach((tab,i)=>{
      tab.addEventListener('click',e=>{e.preventDefault();selectTab(i)});
      tab.addEventListener('keydown',e=>{
        if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
        e.preventDefault();
        const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
        selectTab(next);tabs[next].focus();
      });
    });
    selectTab(english?2:0);
    function update(){
      const selected=fields.filter(i=>i.checked), query=new URLSearchParams();
      fields.forEach(i=>{
        const label=i.closest('label');
        label.classList.toggle('is-active',i.checked);
        label.querySelector('.w-checkbox-input').classList.toggle('w--redirected-checked',i.checked);
      });
      selected.forEach(i=>query.append(i.dataset.facet,i.value));
      if(search)query.set('q',search);
      const found=db.companies.filter(c=>facets.every(key=>{
        const wanted=query.getAll(key).map(normalize);
        return !wanted.length||c.tags[key].some(value=>wanted.includes(normalize(value)));
      })&&(!search||[c.name,...['en','zh'].map(k=>window.directorySource.companies[c.key][k].summary)].some(v=>v.toLowerCase().includes(search))));
      const count=Math.ceil(found.length/12);
      page=Math.min(Math.max(1,page),Math.max(1,count));
      if(page>1)query.set('page',page);
      args=query;
      if(section==='portfolio'){
        const anchor=url('portfolio','',english,query.toString());
        if(location.hash!==anchor)history.replaceState(null,'',anchor);
        header.querySelector('.lang').href=url('portfolio','',!english,query.toString());
      }
      document.getElementById('companies').innerHTML=found.slice((page-1)*12,page*12).map(companyCard).join('');
      const status=document.getElementById('results-count');
      status.classList.toggle('empty',!found.length);
      status.textContent=found.length?local(`${found.length} 家公司`,`${found.length} companies`):local('沒有符合條件的團隊','No matching companies');
      const item=(i,title,cls)=>`<button type="button" data-page="${i}" class="${cls}" ${i===page?'aria-current="page"':''}>${title}</button>`;
      document.getElementById('pages').innerHTML=count>1?(page>1?item(page-1,'‹','previous'):'')+'<div class="pagination_page-design-2">'+Array.from({length:count},(_,i)=>item(i+1,String(i+1),'pagination_page-button-2')).join('')+'</div>'+(page<count?item(page+1,'›','next'):''):'';
    }
    fields.forEach(i=>i.addEventListener('change',()=>{page=1;update()}));
    reset.addEventListener('click',e=>{e.preventDefault();fields.forEach(i=>{i.checked=false});page=1;search='';update()});
    document.getElementById('pages').addEventListener('click',e=>{
      const b=e.target.closest('button[data-page]');if(!b)return;
      page=Number(b.dataset.page);update();shell.querySelector('.po_title').scrollIntoView({block:'start'});
    });
    update();
  }
  function editorialPage(markup,type){
    return '<div class="reference-content editorial-source" data-page="'+type+'">'+markup.replaceAll('#/LANG/',english?'#/en/':'#/zh/')+'</div>';
  }
  function blogFilters(){
    return (args.get('filter')||'').split(',').filter(key=>['accelerator','podcast','startup-stories'].includes(key));
  }
  function blogPage(tag=''){
    const data=db.editorial;
    if(!tag)return editorialPage(data.archive['blog'+pageNumber(2)],'blog');
    const selected=Object.keys(data.posts).filter(key=>data.posts[key].tags.includes(tag));
    const cards=selected.map(key=>data.rawcards[key].replace('bl-fliter-list-item','bl_fliterpage-item')).join('');
    return editorialPage(data.archive.category.replace('[[CATEGORY]]',esc(data.labels[tag]||categories[tag])).replace('[[CARDS]]',cards||'<div class="w-dyn-empty">No items found.</div>'),'category');
  }
  function activateBlogFilter(){
    const source=main.querySelector('.bl-special');
    if(!source)return;
    const live=source.querySelector('.bl-fliter-list-list');
    const checks=[...source.querySelectorAll('[data-blog-category]')];
    const pager=source.querySelector('.w-pagination-wrapper');
    const filters=blogFilters();
    function refresh(keys){
      checks.forEach(el=>{
        el.checked=keys.includes(el.dataset.blogCategory);
        el.closest('label').querySelector('.w-checkbox-input')?.classList.toggle('w--redirected-checked',el.checked);
      });
      if(!keys.length)return;
      const cards=Object.keys(db.editorial.posts).filter(k=>keys.includes(db.editorial.posts[k].tags[0]));
      live.innerHTML=cards.map(k=>db.editorial.rawcards[k]).join('').replaceAll('#/LANG/',english?'#/en/':'#/zh/');
      live.querySelectorAll('[data-source-img]').forEach(el=>el.src=db.assets[el.dataset.sourceImg]);
      if(pager)pager.hidden=true;
    }
    function set(keys){
      const target=url('blog','',english,keys.length?new URLSearchParams({filter:keys.join(',')}).toString():'');
      if(target===location.hash)return;
      window.addEventListener('hashchange',()=>main.querySelector('.bl-special')?.scrollIntoView(),{once:true});
      location.hash=target;
    }
    checks.forEach(el=>el.addEventListener('change',()=>{
      const keys=new Set(filters);
      if(el.checked)keys.add(el.dataset.blogCategory);else keys.delete(el.dataset.blogCategory);
      set([...keys]);
    }));
    source.querySelectorAll('[data-clear-blog]').forEach(el=>el.addEventListener('click',()=>set([])));
    refresh(filters);
  }
  function postPage(){
    const markup=db.editorial.postpages[id];
    return markup?editorialPage(markup,'post'):missingPage();
  }
  function activatePost(){
    const copy=main.querySelector('[data-copy-post]');
    if(copy)copy.addEventListener('click',()=>{
      const href=location.href;
      if(navigator.clipboard)navigator.clipboard.writeText(href).catch(()=>window.prompt('Copy page link',href));
      else window.prompt('Copy page link',href);
    });
  }
  function pageNumber(count){return Math.max(1,Math.min(count,Number.parseInt(args.get('page'),10)||1))}
  function pageLinks(key,count,active,detail=''){
    if(count<2)return '';
    return `<nav class="archive-pages" aria-label="${local('分頁','Pagination')}">${Array.from({length:count},(_,i)=>`<a href="${url(key,detail,english,i?'page='+(i+1):'')}" ${active===i+1?'aria-current="page"':''}>${i+1}</a>`).join('')}</nav>`;
  }
  function newsPage(){
    return editorialPage(db.editorial.archive['news'+pageNumber(4)],'news');
  }
  function readingPage(kind){
    if(kind==='job'){
      const markup=db.editorial.jobs[id];
      return markup?editorialPage(markup,'job'):missingPage();
    }
    const item=db.editorial.news[id];
    if(!item)return missingPage();
    return editorialPage(`<section class="ne_section"><article class="container_fix w-container editorial-legacy-story">${back('news','News')}
      <h1 class="h3">${esc(item.title)}</h1><p>${esc(item.outlet)} / ${esc(item.date)}</p>
      ${item.cover?picture(item.cover):''}<p>${esc(item.body)}</p><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">Read More ↗</a></article></section>`,'story');
  }
  function programPage(){
    const parts=[
      ['training','三個月加速器計畫','Three-month program'],['investing','投資偏好','Investment focus'],
      ['resources','為什麼選擇 SparkLabs Taiwan','Why join SparkLabs Taiwan?'],['milestones','里程碑','Milestones'],
      ['founders','新創團隊怎麼說','Alumni perspectives'],['outcomes','團隊事蹟','Alumni outcomes'],
      ['application','加速器計畫期程','Application process'],['faq','常見問題','FAQ']
    ];
    const jump=(part,label,cls='')=>`<a class="${cls}" href="${url('program','',english,'part='+part)}">${esc(label)}</a>`;
    const block=(part,body)=>{const item=parts.find(row=>row[0]===part);return `<section class="program-block" id="program-${part}" tabindex="-1"><h2>${esc(item[english?2:1])}</h2>${body}</section>`};
    const first=`<section class="program-intro">
      ${picture('program-shape','','scene-shape program-shape')}
      <div class="program-columns"><div class="program-description"><h2>${local('加速器計畫','Accelerator Program')}</h2>
        <h3>DREAM BIG. GO GLOBAL!</h3><p>${local('SparkLabs Taiwan 是新創加速器也是創投基金，採取「入選加速器計畫即投資」。自 2018 年以來，我們已經投資並加速超過 60 間早期新創，分佈在十分多元的產業，已有 2 家校友成功出場。','SparkLabs Taiwan invests in each startup it admits to its accelerator. Since 2018, it has backed more than 60 early-stage companies across different industries, with two exits among its alumni.')}</p></div>
        <aside class="batch-card"><h3>${local('第十二屆新創加速器計畫','Batch 12 Accelerator Program')}</h3>
          <dl><dt>${local('申請截止','Application deadline')}</dt><dd>${local('採隨到隨審方式受理申請','Applications are reviewed on a rolling basis')}</dd>
          <dt>${local('計畫開始','Program kickoff')}</dt><dd>${local('錄取後立即開始','Upon acceptance')}</dd></dl>
          ${jump('application',local('申請計畫','Apply now'),'apply-button')}
        </aside></div></section>`;
    const outline=`<nav class="program-index" aria-label="${local('計畫目錄','Program contents')}">${parts.map(row=>jump(row[0],row[english?2:1])).join('')}</nav>`;
    const weeks=[
      ['1','目標設定','Orientation','和輔導團隊訂出三個月內要驗證的假設與成果。','Agree on the work to validate and the outcomes to aim for.'],
      ['2–3','產品','Product','訪談使用者，選擇能衡量產品與市場契合度的指標。','Interview users and choose measures of product-market fit.'],
      ['4–5','商務拓展','Business development','規劃銷售通路、尋找商業夥伴，準備進入海外市場。','Plan distribution, identify partners and prepare for market entry.'],
      ['6–7','公司治理','Governance','討論團隊文化、領導方式、會計與財務預測。','Work on leadership, culture, accounting and financial forecasts.'],
      ['8–12','募資與發表','Fundraising','準備投資簡報與盡職調查資料，練習公開發表，在 DemoDay 與投資人見面。','Prepare a pitch and due-diligence materials, rehearse and meet investors at DemoDay.']
    ];
    const curriculum=weeks.map(r=>`<details><summary>${local('第 '+r[0]+' 週','Week '+r[0])} · ${r[english?2:1]}</summary><p>${r[english?4:3]}</p></details>`).join('');
    const faqs=[
      ['哪些團隊適合申請？','Which startups are a fit?','解決具體的客戶問題、正在規劃國際市場的早期團隊可提出申請。','Early-stage teams addressing a customer problem and planning to expand internationally can apply.'],
      ['入選後的投資條件是什麼？','What are the investment terms?','計畫頁列出的原則是投資至少 10 萬美元，換取至多 7% 股權，另提供課程與導師輔導。','The program describes an investment of at least US$100,000 for up to 7% equity, alongside mentoring and training.'],
      ['海外市場一定是美國嗎？','Do we need to target the US?','團隊可依產品與客戶選擇目標市場，過去校友也曾拓展日本、韓國、法國及東南亞。','Alumni have entered Japan, Korea, France and Southeast Asia as well as the US.'],
      ['申請時需要已有海外營收嗎？','Do we need overseas sales to apply?','申請階段看重產品的國際發展潛力，團隊可以在開始海外營運前提出申請。','Teams may apply before launching international operations. The selection process considers the potential to grow abroad.'],
      ['英文能力如何影響評選？','Is English fluency required?','語言流利度並非主要評選條件；在進入目標市場時，團隊最好有人能用當地語言與客戶溝通。','Fluency is not a main selection criterion. The team should be able to communicate with customers in its chosen market.']
    ];
    const faq=faqs.map(r=>`<details><summary>${r[english?1:0]}</summary><p>${r[english?3:2]}</p></details>`).join('');
    const voices=[
      ['Allan Ko','Influenxio','在行銷以外，導師也協助他處理第一次創業面對的營運與募資問題。','Mentors helped him work through operations and fundraising as a first-time founder.'],
      ['Jason Chen','Just Kitchen','團隊把餐飲和供應鏈經驗帶進加速器，並與導師討論如何補強技術能力。','The team brought food and logistics experience and discussed its technology needs with mentors.'],
      ['Duncan Huang','Yallvend','討論過程讓團隊重新思考產品能服務哪些客戶。','The program helped the team see new applications for its product.'],
      ['Kim Chang','SmartTag','團隊藉由輔導補足募資經驗，認識更多產業夥伴。','Mentoring strengthened the team’s fundraising knowledge and industry contacts.'],
      ['Wenyu Chen','InfinitiesSoft','除了技術與營運建議，團隊也重視導師在計畫期間持續參與。','The founders valued the ongoing involvement of the accelerator team as well as its professional advice.']
    ];
    const alumni=voices.map(r=>`<article><h3>${r[0]}</h3><strong>${r[1]}</strong><p>${r[english?3:2]}</p></article>`).join('');
    return showHero(navName('program'),'program')+first+`<div class="program-body">${outline}
      ${block('training',`<p>${local('計畫以三個月為一期，創辦人與導師每週檢視產品、市場和募資進度。','The three-month program pairs weekly coaching with a curriculum in product, business development and fundraising.')}</p><div class="program-disclosures">${curriculum}</div>`)}
      ${block('investing',`<p>${local('團隊評估產品解決的實際需求、成長空間與可累積的資料，也關注創辦人打算先進入哪個海外市場。','The team considers the customer problem, growth potential, data generated by the business and the first overseas market a founder intends to enter.')}</p>`)}
      ${block('resources',`<p>${local('入選後，可參與一對一輔導與主題課程，透過全球導師和企業夥伴尋找客戶，並在 DemoDay 向投資人發表。畢業後仍可使用校友網絡。','Selected founders receive individual coaching and introductions to mentors and corporate partners, pitch at DemoDay and stay connected through the alumni network.')}</p>${actions(['people','collaborate','demoday'])}`)}
      ${milestones()}
      ${block('founders',`<div class="alumni-notes">${alumni}</div>`)}
      ${block('outcomes',`<div class="outcome-links">${link('company','Just Kitchen','just-kitchen')}<p>${local('雲端廚房業者，於 2021 年掛牌。','The cloud-kitchen company went public in 2021.')}</p>${link('company','ParseMe','parseme')}<p>${local('企業資料處理新創，於 2021 年由 Gemini Data 收購。','Gemini Data acquired the enterprise data technology startup in 2021.')}</p></div>`)}
      ${block('application',`<ol class="program-steps">${(english?['Submit an application','Complete three interview stages','Receive the selection decision','Start upon acceptance']:['遞交申請','三階段面試','確認入選結果','錄取後開始計畫']).map(s=>`<li>${s}</li>`).join('')}</ol><p class="offline-note">${local('這是離線展示，僅供查看報名流程，無法送出申請。','This offline edition shows the application process. Applications cannot be submitted here.')}</p>`)}
      ${block('faq',`<div class="program-disclosures">${faq}</div>`)}
      </div>`;
  }
  function referencePage(key){
    const markup=db.referenceLayouts[key+'-'+(english?'en':'zh')];
    return '<div class="reference-content" data-page="'+key+'">'+markup+'</div>';
  }
  function activateReference(){
    const root=main.querySelector('.reference-content');
    if(!root)return;
    if(root.dataset.page==='career'&&english&&db.careerTail){
      footer.insertAdjacentHTML('afterend','<div id="career-tail" class="reference-content">'+db.careerTail+'</div>');
    }
    if(root.dataset.page==='demoday'){
      const title=root.querySelector('h1');
      if(title&&!title.textContent.trim()){title.textContent='DemoDay';title.classList.add('accessible-only')}
      const original=root.querySelector('select.dd_fliter');
      if(original){
        const cards=Array.from(root.querySelectorAll('.previous_dd_card'));
        const options=new Map([...original.options].map(o=>[o.value.toLowerCase(),o.textContent]));
        const terms=[...new Set(cards.map(c=>c.querySelector('.dd_tag')?.textContent.trim()).filter(Boolean))].sort((a,b)=>b.localeCompare(a,'en',{numeric:true}));
        const select=document.createElement('select');select.className='offline-speaker-filter';select.setAttribute('aria-label',local('依 DemoDay 屆數篩選講者','Filter speakers by DemoDay'));
        select.add(new Option(local('全部屆數','All editions'),''));
        for(const term of terms)select.add(new Option(options.get(term.toLowerCase())||term,term));
        original.closest('form').replaceWith(select);
        const empty=root.querySelector('.c-filter_empty');if(empty)empty.hidden=true;
        select.addEventListener('change',()=>cards.forEach(card=>{card.hidden=Boolean(select.value&&card.querySelector('.dd_tag')?.textContent.trim()!==select.value)}));
        if(terms.some(t=>t.toLowerCase()==='demoday 7')){select.value=terms.find(t=>t.toLowerCase()==='demoday 7');select.dispatchEvent(new Event('change'))}
      }
    }
    root.querySelectorAll('.w-slider').forEach(slider=>{
      const slides=[...slider.querySelectorAll(':scope > .w-slider-mask > .w-slide')];
      if(!slides.length)return;
      const previous=slider.querySelector(':scope > .w-slider-arrow-left'),next=slider.querySelector(':scope > .w-slider-arrow-right'),dots=slider.querySelector(':scope > .w-slider-nav');
      if(slides.every(s=>s.classList.contains('pitch_video'))){
        slider.classList.add('video-carousel');
        slider.setAttribute('aria-label',local('近期新創團隊影片','Recent startup pitches'));
        let page=0,perPage=0;
        const pages=()=>Math.ceil(slides.length/perPage);
        function showPage(index){
          page=(index+pages())%pages();
          slides.forEach((slide,i)=>{slide.hidden=i<page*perPage||i>=(page+1)*perPage});
          dots?.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===page)));
        }
        function resize(){
          const count=slider.clientWidth>=980?3:slider.clientWidth>=640?2:1;
          if(count===perPage)return;
          const first=page*perPage;perPage=count;slider.style.setProperty('--video-columns',count);
          if(dots){
            dots.replaceChildren();
            for(let i=0;i<pages();i++){
              const button=document.createElement('button');button.type='button';button.className='offline-slide-dot';
              button.setAttribute('aria-label',local('第 ','Page ')+(i+1)+local(' 頁影片',' of videos'));
              button.addEventListener('click',()=>showPage(i));dots.append(button);
            }
          }
          showPage(Math.floor(first/perPage));
        }
        [previous,next].forEach((control,i)=>{
          if(!control)return;
          control.tabIndex=0;control.setAttribute('role','button');
          control.setAttribute('aria-label',i?local('下一頁影片','Next videos'):local('上一頁影片','Previous videos'));
          control.addEventListener('click',()=>showPage(page+(i?1:-1)));
          control.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();control.click()}});
        });
        resize();
        const observer=new ResizeObserver(resize);observer.observe(slider);referenceObservers.push(observer);
        return;
      }
      let active=0;
      function show(i){active=(i+slides.length)%slides.length;slides.forEach((s,j)=>s.hidden=j!==active);dots?.querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-pressed',String(j===active)))}
      [previous,next].forEach((el,i)=>{if(!el)return;el.hidden=slides.length<2;if(el.hidden)return;el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label',i?local('下一張','Next slide'):local('上一張','Previous slide'));el.addEventListener('click',()=>show(active+(i?1:-1)));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click()}})});
      if(dots){dots.replaceChildren();dots.hidden=slides.length<2;if(!dots.hidden)slides.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',local('切換至第 ','Go to slide ')+(i+1));b.className='offline-slide-dot';b.addEventListener('click',()=>show(i));dots.append(b)})}
      show(0);
    });
    root.querySelectorAll('[data-source-img]').forEach(el=>{el.src=db.assets[el.dataset.sourceImg]});
    root.querySelectorAll('[data-source-bg]').forEach(el=>{el.style.backgroundImage='url("'+db.assets[el.dataset.sourceBg]+'")'});
    root.querySelectorAll('.w-dropdown').forEach((group,i)=>{
      const control=group.querySelector('.w-dropdown-toggle'),panel=group.querySelector('.w-dropdown-list');
      if(!control||!panel)return;
      panel.id=panel.id||'reference-panel-'+i;
      control.setAttribute('role','button');control.tabIndex=0;control.setAttribute('aria-controls',panel.id);
      function toggle(open){control.setAttribute('aria-expanded',String(open));control.classList.toggle('w--open',open);panel.classList.toggle('w--open',open);panel.hidden=!open}
      toggle(false);
      control.addEventListener('click',()=>toggle(panel.hidden));
      control.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle(panel.hidden)}else if(e.key==='Escape')toggle(false)});
    });
    root.querySelectorAll('form').forEach(form=>{
      const status=document.createElement('p');status.className='offline-response';status.setAttribute('role','status');form.append(status);
      form.addEventListener('submit',e=>{e.preventDefault();status.textContent=local('離線展示：資料未送出。','Offline preview: your information was not sent.')});
    });
  }
  function sourceNotice(trigger){
    const dialog=document.createElement('dialog');dialog.className='offline-dialog';
    const text=trigger.textContent.trim()||trigger.getAttribute('aria-label')||local('線上服務','Online service');
    dialog.innerHTML='<h2>'+esc(text)+'</h2><p>'+local('這項服務需要連網。離線版僅供查看服務資訊。','This service requires an internet connection. Service information is available in the offline edition.')+'</p><button type="button">'+local('返回頁面','Return to page')+'</button>';
    main.append(dialog);dialog.showModal();dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{dialog.remove();trigger.focus({preventScroll:true})},{once:true});
  }
function hatcherPage() {
    return window.hatcherPages[english ? 'en' : 'zh'];
  }
  function activateHatcher() {
    const root = main.querySelector('.hatcher-source');
    for (const img of root.querySelectorAll('[data-hatcher-image]')) {
      const id = img.dataset.hatcherImage;
      const asset = db.assets['hatcher-' + id] || window.hatcherAssetFiles['hatcher-'+id] || db.assets[db.hatcherMedia[id]];
      if (asset) img.src = asset;
    }
    const {part} = Object.fromEntries(args);
    if (part) for (const link of root.querySelectorAll('[data-hatcher-language]')) {
      link.href = url('hatcher','',link.dataset.hatcherLanguage === 'en',new URLSearchParams({part}).toString());
    }
    root.addEventListener('click', event => {
      const anchor = event.target.closest('a[data-hatcher-section]');
      const button = event.target.closest('button');
      const mobile = root.querySelector('[data-hatcher-mobile-toggle]');
      const mobilePanel = root.querySelector('#hatcher-mobile-menu');
      if (anchor && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button===0) {
        const destination = document.getElementById(anchor.dataset.hatcherSection);
        if (!destination) return;
        event.preventDefault();
        if (anchor.hash!==location.hash) history.pushState(null,'',anchor.hash);
        for (const langLink of root.querySelectorAll('[data-hatcher-language]')) {
          langLink.href = url('hatcher','',langLink.dataset.hatcherLanguage==='en',new URLSearchParams({part:destination.id}).toString());
        }
        destination.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
        mobile.setAttribute('aria-expanded','false');
        mobilePanel.hidden=true;
        return;
      }
      if (!button) return;
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      if (!panel) return;
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded',String(open));
      panel.hidden = !open;
      if (button===mobile) {
        button.setAttribute('aria-label',open?local('關閉選單','Close menu'):local('開啟選單','Open menu'));
      } else if (button.hasAttribute('data-highlight-toggle')) {
        button.querySelector('span').textContent = open ? button.dataset.closeLabel : button.dataset.openLabel;
        panel.setAttribute('aria-hidden',String(!open));
      } else if (button.hasAttribute('data-hatcher-faq')) {
        const marker = button.lastElementChild;
        for (const cls of ['rotate-45','bg-[#1A73E8]']) marker.classList.toggle(cls,open);
        marker.classList.toggle('bg-slate-100',!open);
        const plus = marker.querySelector('svg');
        plus.classList.toggle('text-white',open);
        plus.classList.toggle('text-slate-900',!open);
      }
    });
    root.addEventListener('keydown',event=>{
      if(event.key!=='Escape')return;
      const btn=root.querySelector('[data-hatcher-mobile-toggle][aria-expanded="true"]');
      if(btn){btn.click();btn.focus();}
    });
  }
  function contentPage(key){
    if(key==='hatcher')return hatcherPage();
    if(db.referenceLayouts?.[key+'-'+(english?'en':'zh')])return referencePage(key);
    const banner=({core:'program',gtm:'program',hatcher:'home',invest:'portfolio'})[key]||key;
    const hero=showHero(navName(key),banner);
    if(key==='invest'){
      return hero+sectionBlock(heading(local('投資早期新創團隊','Investing in early-stage startups'))+`<p class="lead">${local('從種子輪前到 A 輪，SparkLabs Taiwan 協助台灣團隊開拓海外市場，也陪伴國際團隊在亞洲建立據點。','From pre-seed through Series A, the team helps Taiwan-based founders expand overseas and international founders establish themselves in Asia.')}</p>`)+
        milestones()+sectionBlock(heading(local('成功出場紀錄','Alumni exits'))+
          `<div class="case-pair"><article>${picture('co-parseme','ParseMe')}<h3>${link('company','ParseMe','parseme')}</h3><p>${local('企業資料處理與壓縮技術公司，於 2021 年由 Gemini Data 收購。','Gemini Data acquired this enterprise data and compression company in 2021.')}</p></article><article>${picture('co-just-kitchen','Just Kitchen')}<h3>${link('company','Just Kitchen','just-kitchen')}</h3><p>${local('以雲端廚房與外送通路營運餐飲品牌，於 2021 年掛牌。','The cloud-kitchen operator took its food delivery business public in 2021.')}</p></article></div>${actions(['portfolio','people'])}`);
    }
    if(key==='collaborate'){
      const rows=[
        ['共創企業加速器計畫','Corporate accelerators','適合規劃產業加速器或創新競賽的企業。從選題、徵件到一對一輔導，企業可以和加速器一起設計整期計畫。','Corporate partners can design an industry accelerator or innovation challenge, from selecting a theme and recruiting teams to arranging one-to-one mentoring.','高通台灣創新競賽','Qualcomm Innovate in Taiwan Challenge'],
        ['媒合企業創新解方','Startup solutions for business','企業先說明流程上的瓶頸，再由團隊安排與相關新創會面及測試。一卡通與 EMILY.RPA 的流程自動化合作是其中一例。','The process starts with an operating problem. The accelerator introduces relevant startups for a pilot, as it did when iPASS explored automation with EMILY.RPA.','',''],
        ['成為新創生態圈夥伴','Startup ecosystem partnerships','已有產品、專業服務或設備的企業，可以把資源提供給合適的新創，並透過實際使用建立合作關係。','Companies can introduce their tools, facilities or specialist services to founders who need them and develop partnerships through practical use.','','']
      ];
      return hero+sectionBlock(heading(local('我們與企業攜手合作，打造更好的新創生態系','Working with companies to support startup growth'))+
        `<div class="partner-stories">${rows.map((r,i)=>`<article><h3>${r[english?1:0]}</h3><div><p>${r[english?3:2]}</p>${i===0?`<p><strong>${r[english?5:4]}</strong></p>`:i===1?link('company','EMILY.RPA','emily-rpa','action'):''}</div></article>`).join('')}</div>${actions(['portfolio','program'])}`);
    }
    if(key==='career'){
      return hero+sectionBlock(heading(local('和台灣新創一起走向國際','Help Taiwanese startups go global'))+
        `<p class="lead">${local('團隊的工作橫跨基金、加速器營運與產業合作。成員可以直接與創辦人及業界導師共事，研究不同的商業模式，也能從構想到執行負責一項專案。','The team works across venture investment, accelerator operations and industry partnerships. Staff work directly with founders and mentors, learn how different businesses operate and lead projects from idea to delivery.')}</p>${actions(['portfolio','people'])}`)+
        sectionBlock(heading(local('職缺','Open roles'))+`<div class="rows">${db.roles.map(r=>row('job',r[0],r[english?2:1],r[english?4:3])).join('')}</div>`,'tint');
    }
    if(key==='demoday'){
      return hero+sectionBlock(heading(local('第十屆 DemoDay','DemoDay 10'))+`<p class="lead">${local('即將登場','Coming soon')}</p>`)+
        sectionBlock(heading(local('團隊發表與爐邊對談','Startup pitches and fireside conversations'))+storyGrid(db.sections.demoday))+
        sectionBlock(heading(local('第八屆活動回顧','DemoDay 8 archive'))+`<p>2024.08.02</p><p class="lead">${local('活動包括新創團隊發表、攤位交流及爐邊對談，涵蓋智慧物流、企業自動化、電商、AI、醫療和人資科技。','The event brought together founders in smart logistics, automation, e-commerce, AI, healthcare and HR technology for pitches, exhibits and fireside conversations.')}</p>${actions(['portfolio','program','news'])}`,'tint');
    }
    const detail=storyGrid(db.sections[key]);
    const related=({core:['gtm','program'],gtm:['core','program'],hatcher:['program','portfolio']})[key];
    return hero+sectionBlock(`<div class="intro"><h2>${esc(sectionName(key))}</h2><p class="lead">${esc(caption(key))}</p></div>${detail}${key==='gtm'?picture('workshop-poster',local('歷屆工作坊海報','Archived workshop poster'),'poster'):''}${actions(related)}`);
  }
  function mapPage(){
    const other=[['old-home','舊版首頁','Former homepage'],['style-guide','樣式指南','Style guide'],['temp','暫存頁','Temp'],['access-denied','存取受限','Access Denied'],['log-in','登入','Log in'],['sign-up','註冊','Sign up'],['reset-password','重設密碼','Reset Password'],['update-password','更新密碼','Update Password'],['user-account','使用者帳戶','User Account']];
    return showHero(sectionName('map'),'')+sectionBlock(`<div class="tiles">${sectionKeys.filter(k=>k!=='map').map(k=>`<a class="tile" href="${url(k)}"><h3>${esc(navName(k))}</h3><p>${esc(caption(k))}</p></a>`).join('')}</div>`)+sectionBlock(heading(local('專欄分類','Blog categories'))+`<div class="chips">${db.categories.map(catLink).join('')}</div>`,'tint')+sectionBlock(heading(local('其他頁面','Other pages'))+`<div class="chips">${other.map(([key,zh,en])=>`<a class="chip" href="${url(key,'',true)}">${local(zh,en)}</a>`).join('')}</div>`);
  }
  function missingPage(){
    return sectionBlock(`<h1>${local('找不到這個展示頁面','Page not found')}</h1>${actions(['home','map'])}`);
  }
  function render(navigated=false){
    document.getElementById('career-tail')?.remove();
    referenceObservers.forEach(observer=>observer.disconnect());referenceObservers=[];
    const hash=location.hash.slice(1);
    const [path,query='']=hash.split('?');
    const parts=path.split('/').filter(Boolean);
    english=parts[0]==='en';
    section=parts[1]||'home';
    try{id=decodeURIComponent(parts[2]||'')}catch{id=''}
    args=new URLSearchParams(query);
    if(section==='user-account'){
      section='log-in';english=true;id='';
      args=new URLSearchParams({usredir:'/user-account'});
      history.replaceState(null,'',url(section,'',true,args.toString()));
    }
    const language=english?'en':'zh-Hant';
    delete document.documentElement.dataset.mentorDirect;
    const sameDirectory=document.documentElement.lang===language && main.querySelector('.partners');
    const previousDialog=main.querySelector('.member-dialog');
    const previousMember=previousDialog?.dataset.member;
    const previousType=previousDialog?.dataset.type;
    if(previousDialog){previousDialog.close();previousDialog.remove()}
    document.documentElement.lang=language;
    const companyDialog=main.querySelector('.company-dialog');
    if(companyDialog){companyDialog.close();companyDialog.remove()}
    if(section==='company' && db.companies.some(c=>c.key===id)){
      if(!main.querySelector('#companies') || main.dataset.companyLanguage!==language){
        chrome();main.innerHTML=portfolioPage();filterCompanies();main.dataset.companyLanguage=language;
      }
      const dialog=document.createElement('dialog');dialog.className='company-dialog';dialog.setAttribute('aria-label',db.companies.find(c=>c.key===id).name);
      dialog.innerHTML=companyPage()+'<button class="member-close" autofocus type="button" aria-label="'+local('關閉公司介紹','Close company profile')+'"></button>';
      function closeCompany(){
        if(history.state?.companyOpener){history.back();return}
        location.hash=url('portfolio');
      }
      dialog.querySelector('.member-close').addEventListener('click',closeCompany);
      dialog.addEventListener('cancel',event=>{event.preventDefault();closeCompany()});
      dialog.addEventListener('click',event=>{if(event.target===dialog)closeCompany()});
      main.append(dialog);dialog.showModal();
      document.title=dialog.getAttribute('aria-label')+' | SparkLabs Taiwan';
      header.querySelector('.lang').href=url('company',id,!english);
      return;
    }
    if(section==='portfolio' && companyDialog && main.dataset.companyLanguage===language && companyDialog.dataset.opener){
      header.querySelector('.lang').href=url('portfolio','',!english,args.toString());
      document.title=sectionName('portfolio')+' | SparkLabs Taiwan';
      main.querySelector('a.company[href="'+companyDialog.dataset.opener+'"]')?.focus({preventScroll:true});
      return;
    }
    if(section==='member'||section==='mentor'){
      const mentor=section==='mentor'?db.mentors.find(m=>m[0]===id):null;
      if(mentor&&!history.state?.memberOpener){
        document.documentElement.dataset.mentorDirect='true';
        main.innerHTML=directMentorPage(mentor);
        document.title=mentor[1]+' | SparkLabs Taiwan';
        window.scrollTo(0,0);
        if(navigated)main.focus({preventScroll:true});
        return;
      }
      const bio=mentor&&db.mentorProfiles[mentor[0]];
      const member=mentor&&bio?[mentor[0],mentor[1],mentor[1],mentor[2],mentor[3],mentor[3],bio.paragraphs.join('\n\n'),bio.paragraphs.join('\n\n')]:db.members.find(m=>m[0]===id && section==='member');
      if(member){
        if(!sameDirectory){chrome();main.innerHTML=peoplePage();peopleSearch()}
        openMemberDialog(member,mentor);
        return;
      }
    }
    if(section==='people' && sameDirectory && previousMember){
      header.querySelector('.lang').href=url('people','',!english,args.toString());
      const card=main.querySelector('a[href="'+url(previousType,previousMember)+'"]');
      card?.focus({preventScroll:true});
      document.title=sectionName('people')+' | SparkLabs Taiwan';
      return;
    }
    chrome();
    let html;
    switch(section){
      case 'home':case 'program':html=referencePage(section);break;
      case 'people':html=peoplePage();break;
      case 'mentor':case 'member':html=missingPage();break;
      case 'portfolio':html=portfolioPage();break;
      case 'company':html=companyPage();break;
      case 'blog':html=blogPage();break;
      case 'category':html=db.categories.includes(id)?blogPage(id):missingPage();break;
      case 'news':html=newsPage();break;
      case 'post':html=postPage();break;
      case 'story':case 'job':html=readingPage(section);break;
      case 'map':html=mapPage();break;
      case 'old-home':case 'style-guide':case 'temp':html=window.legacyPages[section];break;
      case 'access-denied':case 'log-in':case 'sign-up':case 'reset-password':case 'update-password':html=window.accountPages[section];break;
      default:html=db.sections[section]||section==='career'?contentPage(section):missingPage();
    }
    main.innerHTML=html;
    activateReference();
    if(window.legacyPages?.[section])window.activateLegacyPage(main.querySelector('.legacy-source'));
    if(section==='hatcher')activateHatcher();
    if(section==='blog')activateBlogFilter();
    if(section==='post')activatePost();
    document.title=(main.querySelector('h1')?.textContent||'SparkLabs Taiwan')+' | SparkLabs Taiwan';
    if(section==='people')peopleSearch();
    if(section==='portfolio'){main.dataset.companyLanguage=language;filterCompanies()}
    window.scrollTo(0,0);
    const programAnchors={training:'3-Month',investing:'Investment-Preference',resources:'Why-Join-Us',milestones:'Milestones',founders:'Testimonies',outcomes:'Success-Stories',application:'Application-Process',faq:'FAQ'};
    const jumpTarget=section==='program'&&args.has('part')?document.getElementById(programAnchors[args.get('part')]):section==='hatcher'&&args.has('part')?document.getElementById(args.get('part')):section==='people'&&args.get('part')==='mentors'?document.getElementById('mentor-index'):null;
    if(jumpTarget){jumpTarget.scrollIntoView();jumpTarget.focus({preventScroll:true})}
    else if(navigated)main.focus({preventScroll:true});
  }
  main.addEventListener('click',event=>{
    const trigger=event.target.closest('[data-source-action]');
    if(trigger){sourceNotice(trigger);return}
    const jump=event.target.closest('[data-source-jump]');
    if(jump){const target=document.getElementById(jump.dataset.sourceJump);if(target)target.scrollIntoView();else sourceNotice(jump);return}
    if(section==='portfolio' && event.button===0 && !(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)){
      const company=event.target.closest('a.company');if(company){
        event.preventDefault();history.pushState({companyOpener:location.hash},'',company.hash);render(true);
        const dialog=main.querySelector('.company-dialog');if(dialog)dialog.dataset.opener=company.hash;
        return;
      }
    }
    if(section!=='people'||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const card=event.target.closest('a.person');
    if(!card || (!card.hash.startsWith(url('member')+'/')&&!card.hash.startsWith(url('mentor')+'/')))return;
    event.preventDefault();
    history.pushState({memberOpener:location.hash},'',card.hash);
    render(true);
  });
  header.addEventListener('click',e=>{
    const btn=e.target.closest('.mobile-toggle');
    if(btn){const open=header.querySelector('.navbar-4').classList.toggle('menu-open');btn.setAttribute('aria-expanded',String(open));}
    if(e.target.closest('.back2top'))window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    const group=e.target.closest('details');
    if(group)header.querySelectorAll('details[open]').forEach(d=>{if(d!==group)d.open=false});
    if(e.detail&&desktopHover.matches&&group?.matches('.nav_dropd[open]:hover')&&e.target.closest('summary'))e.preventDefault();
    if(e.target.closest('.language_btn [aria-current="true"]')){e.preventDefault();group.open=false;}
  });
  const desktopHover=matchMedia('(min-width:992px) and (hover:hover)');
  header.addEventListener('pointerover',event=>{
    const group=event.target.closest('.nav_dropd');
    if(!desktopHover.matches||!group||group.contains(event.relatedTarget))return;
    header.querySelectorAll('details[open]').forEach(d=>{if(d!==group)d.open=false});
    group.open=true;
  });
  header.addEventListener('pointerout',event=>{
    const group=event.target.closest('.nav_dropd');
    if(desktopHover.matches&&group&&!group.contains(event.relatedTarget)&&!group.contains(document.activeElement))group.open=false;
  });
  let lastHeaderY=0;
  window.addEventListener('scroll',()=>{
    if(section==='hatcher'){
      main.querySelector('.hatcher-source')?.classList.toggle('hatcher-scrolled',window.scrollY>12);
      return;
    }
    const bar=header.querySelector('.navbar-4');
    if(!bar)return;
    const y=Math.max(window.scrollY,0);
    bar.classList.toggle('past-hero',y>120);
    if(Math.abs(y-lastHeaderY)>=4||y===0){
      bar.classList.toggle('slide-up',y>90&&y>lastHeaderY&&!bar.contains(document.activeElement)&&!bar.classList.contains('menu-open'));
      lastHeaderY=y;
    }
    header.querySelector('.back2top').hidden=y<160;
  },{passive:true});
  document.addEventListener('click',e=>{
    const samePart=e.target.closest('.program-index a,.apply-button');
    if(section==='program'&&samePart?.hash===location.hash){
      const target=document.getElementById('program-'+args.get('part'));
      if(target){e.preventDefault();target.scrollIntoView();target.focus({preventScroll:true})}
    }
    if(!e.target.closest('header details'))header.querySelectorAll('details[open]').forEach(d=>d.open=false);
    if(e.target.closest('.skip')){e.preventDefault();main.focus();}
    const a=e.target.closest('nav a');
    if(a&&a.hash===location.hash){header.querySelector('.navbar-4')?.classList.remove('menu-open');header.querySelector('.mobile-toggle')?.setAttribute('aria-expanded','false');header.querySelectorAll('details[open]').forEach(d=>d.open=false);}
  });
  document.addEventListener('keydown',e=>{
    if(e.key!=='Escape')return;
    const open=header.querySelector('details[open]');
    if(open){open.open=false;open.querySelector('summary').focus();return}
    const nav=header.querySelector('.navbar-4.menu-open');
    if(nav){nav.classList.remove('menu-open');const btn=header.querySelector('.mobile-toggle');btn.setAttribute('aria-expanded','false');btn.focus();}
  });
  window.addEventListener('hashchange',()=>render(true));
  render();
})();

