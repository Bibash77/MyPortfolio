# coding: utf-8
"""Dependency-free prerendering and profile extraction. Run from repository root."""
from html.parser import HTMLParser
from html import escape
from pathlib import Path
import hashlib, json, re
ROOT=Path(__file__).resolve().parent.parent
CAT=json.loads((ROOT/'i18n/catalog.json').read_text())
def norm(s): return ' '.join(s.split())
def key(s): return 'text.'+hashlib.sha256(s.encode()).hexdigest()[:12]
class Node:
 def __init__(self,tag='',attrs=(),parent=None,text=None):self.tag=tag;self.attrs=dict(attrs);self.children=[];self.parent=parent;self.text=text
 def all(self,tag=None,cls=None):
  return [n for c in self.children if c.text is None for n in ([c] if (not tag or c.tag==tag) and (not cls or cls in c.attrs.get('class','').split()) else [])+c.all(tag,cls)]
 def content(self,lang='en'):
  if self.text is not None:
   s=norm(self.text);return CAT[s][lang] if s in CAT else s
  return ' '.join(c.content(lang) for c in self.children).strip()
class Parser(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.root=Node();self.node=self.root
 def handle_starttag(self,t,a):
  n=Node(t,a,self.node);self.node.children.append(n)
  if t not in ('meta','link','img','input','br','hr'):self.node=n
 def handle_endtag(self,t):
  n=self.node
  while n.parent:
   if n.tag==t:self.node=n.parent;return
   n=n.parent
 def handle_data(self,s):self.node.children.append(Node(parent=self.node,text=s))
p=Parser();p.feed((ROOT/'tools/page.html').read_text())
# Missing entries are build errors, never silent English fallbacks.
def render(n,lang):
 if n.text is not None:
  if n.parent.tag in ('script','style'):return n.text
  s=norm(n.text)
  if not s:return n.text
  if s not in CAT:raise ValueError('Uncatalogued text: '+s)
  text=escape(CAT[s][lang]);k=key(s)
  if n.parent.tag=='title':return text
  return re.match(r'^\s*',n.text).group(0)+'<i18n-text data-i18n="'+k+'">'+text+'</i18n-text>'+re.search(r'\s*$',n.text).group(0)
 attrs=n.attrs.copy()
 if n.tag=='html':attrs['lang']=lang
 if n.tag=='img' and 'alt' not in attrs:attrs['alt']=''
 for a in ('alt','title','placeholder','aria-label'):
  if attrs.get(a):
   s=attrs[a]
   if s not in CAT:raise ValueError('Uncatalogued attribute: '+s)
   attrs['data-i18n-'+a]=key(s);attrs[a]=CAT[s][lang]
 if n.tag=='title':attrs['data-i18n']=key(n.content('en'))
 if n.tag=='meta' and attrs.get('name')=='description':
  attrs['content']=CAT['meta.description'][lang];attrs['data-i18n-content']='meta.description'
 a=''.join(' '+k+'="'+escape(v or '',quote=True)+'"' for k,v in attrs.items())
 body=''.join(render(c,lang) for c in n.children)
 if not n.tag:return body
 return '<'+n.tag+a+'>'+('' if n.tag in ('meta','link','img','input','br','hr') else body+'</'+n.tag+'>')

def profile(lang):
 r=p.root
 def first(tag=None,cls=None,root=r):return root.all(tag,cls)[0]
 career=[]
 for e in r.all(cls='experience-card'):
  career.append({'company':first('h3',root=e).content(lang),'roleAndDates':first(cls='role',root=e).content(lang),'assignments':[{'name':x.all('h4')[0].content(lang),'period':[d.content(lang) for h in x.all(cls='project-heading') for d in h.all('p')],'responsibilities':[d.content(lang) for d in x.all('li')]} for x in e.all(cls='experience-project')+e.all(cls='system-card')],'responsibilities':[x.content(lang) for x in e.all('li')],'summary':[x.content(lang) for x in e.all(cls='company-summary')],'technology':[x.content(lang) for x in e.all(cls='mini-tech')]})
 projects=[]
 for c in r.all(cls='project-card'):
  projects.append({'name':first('h3',root=c).content(lang),'category':c.attrs['data-category'],'status':first(cls='project-meta',root=c).content(lang),'description':first('p',root=c).content(lang),'contribution':[x.content(lang) for x in c.all(cls='project-profile')],'technologies':[n.content(lang) for g in c.all(cls='project-skills') for n in g.all('span')]+[img.attrs.get('title') or re.search(r'/icons/([^/]+)/',img.attrs.get('src','')).group(1) for g in c.all(cls='tool-icons') for img in g.all('img') if '/icons/' in img.attrs.get('src','')],'links':[x.attrs['href'] for x in c.all('a')],'searchKeywords':c.attrs['data-search']})
 return {'name':'Bibash Bogati','title':CAT['Full-Stack Software Engineer'][lang],'location':CAT['Osaka, Japan'][lang],'summary':first(cls='lead').content(lang),'employment':career,'projects':projects,'skills':[x.content(lang) for x in r.all(cls='stack-group')],'educationTeachingLanguages':[x.content(lang) for x in first(cls='info-grid').all('article')],'source':'https://www.bibashbogati.com.np/','links':{'GitHub':'https://github.com/Bibash77','LinkedIn':'https://www.linkedin.com/in/bibash-bogati-76695b1b4/'}}

if __name__=='__main__':
 assert all(set(v)=={'en','ja'} and all(v.values()) for v in CAT.values())
 dictionaries={lang:{(s if s.startswith(('meta.','ui.')) else key(s)):v[lang] for s,v in CAT.items()} for lang in ('en','ja')}
 (ROOT/'i18n/messages.js').write_text('window.MESSAGES='+json.dumps(dictionaries,ensure_ascii=False)+';\n')
 (ROOT/'data/profile.js').write_text('window.PROFILE='+json.dumps({l:profile(l) for l in ('en','ja')},ensure_ascii=False,indent=2)+';\n')
 for lang,path in [('ja','index.html'),('en','en/index.html'),('ja','ja/index.html')]:
  html='<!doctype html>\n'+render(p.root,lang)
  html=html.replace('<head>','<head>\n  <base href="/">\n  <script src="i18n/locale.js"></script>')
  seo=f'<link rel="canonical" href="https://www.bibashbogati.com.np/{lang}/"><link rel="alternate" hreflang="en" href="https://www.bibashbogati.com.np/en/"><link rel="alternate" hreflang="ja" href="https://www.bibashbogati.com.np/ja/"><link rel="alternate" hreflang="x-default" href="https://www.bibashbogati.com.np/"><meta property="og:title" data-i18n-content="{key("Bibash Bogati | Full-Stack Software Engineer")}" content="{escape(CAT["Bibash Bogati | Full-Stack Software Engineer"][lang])}"><meta property="og:description" data-i18n-content="meta.description" content="{escape(CAT["meta.description"][lang])}"><meta property="og:locale" content="{"ja_JP" if lang=="ja" else "en_US"}"><meta property="og:url" content="https://www.bibashbogati.com.np/{lang}/"><link rel="stylesheet" href="companion/companion.css">'
  html=html.replace('</head>',seo+'</head>')
  switch='<div class="locale-switch" role="group" aria-label="'+('表示言語' if lang=='ja' else 'Display language')+'"><button type="button" data-locale="en" aria-pressed="'+str(lang=='en').lower()+'">EN</button><span aria-hidden="true">|</span><button type="button" data-locale="ja" aria-pressed="'+str(lang=='ja').lower()+'" lang="ja">日本語</button></div>'
  html=html.replace('<div class="nav-actions">','<div class="nav-actions">'+switch,1)
  html=html.replace('<script src="script.js"></script>','<script src="i18n/messages.js"></script><script src="data/profile.js"></script><script src="i18n/apply.js"></script><script src="script.js"></script><script src="companion/prompts.js"></script><script src="companion/companion.js"></script>')
  dest=ROOT/path;dest.parent.mkdir(exist_ok=True);dest.write_text(html)
 print('Built 3 pages, '+str(len(CAT))+' bilingual entries, 18 projects and 5 employers per locale.')
