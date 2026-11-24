import { puppies, image, questions } from './data.js';

const main = document.querySelector('main');
const nav = document.querySelector('#nav');
const menu = document.querySelector('#menu');
const dialog = document.querySelector('#photo');
let gallery = [];
let photoIndex = 0;
let photoTrigger = null;

const button = (href, label, secondary = false) =>
  '<a class="button' + (secondary ? ' secondary' : '') + '" href="#' + href + '">' + label + '</a>';
const intro = (title, description) =>
  '<div class="page-intro"><p class="eyebrow">Little Paws Dubai</p><h1>' + title + '</h1><p>' + description + '</p></div>';
const photos = (list) => list.map((p) => '<a class="card" href="#puppy/' + p.id +
  '"><img loading="lazy" src="' + image(p.image) + '" alt="' + p.breed + ' puppy"><div><span class="pill">' +
  (p.status === 'home' ? 'Gone home' : p.location) + '</span><h3>' + p.name + '</h3><p>' +
  p.breed + ' · ' + p.age + '</p></div></a>').join('');
const accordion = (list) => list.map(([q,a]) => '<details class="details"><summary>' +
  q + '</summary><p>' + a + '</p></details>').join('');
const section = (title, contents) => '<section class="section"><h2>' + title + '</h2>' + contents + '</section>';

function home() {
  return '<section class="hero"><div><div class="eyebrow">Puppy discovery in Dubai</div><h1>Small paws.<br>Big beginnings.</h1><p>Explore the puppy catalog, get to know each breed, and plan a first meeting in Dubai.</p><div class="actions">' +
    button('puppies', 'Browse puppies') + button('visit', 'Plan a visit', true) +
    '</div></div><figure><img fetchpriority="high" src="' + image(0) + '" alt="Apricot Maltipoo sitting on a golden studio backdrop"><figcaption>Meet Maple · Maltipoo</figcaption></figure></section>' +
    '<section class="section"><div class="heading"><div><p class="eyebrow">The catalog</p><h2>Meet the little ones</h2></div>' +
    button('puppies', 'View all puppies', true) + '</div><div class="grid">' + photos(puppies.slice(0,3)) + '</div></section>' +
    section('Find your way to a first meeting', '<div class="split"><article class="panel"><h3>Meet in Dubai</h3><p>Browse puppies listed for an in-person introduction.</p>' +
      button('puppies?location=Dubai+showroom','Showroom puppies') + '</article><article class="panel alt"><h3>Ask about importing</h3><p>Explore profiles listed for an import enquiry.</p>' +
      button('puppies?location=Import+enquiry','Import enquiries') + '</article></div>') +
    section('From first hello to home', '<p>Learn what to ask about health records, travel and collection before any commitment.</p><div class="actions">' +
      button('process','How it works') + button('families','Family gallery',true) + '</div>') +
    section('Frequently asked questions', accordion(questions.slice(0,3)) + '<div class="actions">' + button('faq','All questions',true) + '</div>');
}

function catalog(params) {
  main.innerHTML = intro('Find your puppy','Browse sample profiles by breed, age, and meeting options.') +
    '<form class="filters" id="filters"><label>Search<input name="q" type="search" placeholder="Name or breed"></label><label>Breed<select name="breed"><option value="">All breeds</option>' +
    [...new Set(puppies.map(p => p.breed))].sort().map(b => '<option>' + b + '</option>').join('') +
    '</select></label><label>Location<select name="location"><option value="">Any location</option><option>Dubai showroom</option><option>Import enquiry</option></select></label>' +
    '<label>Status<select name="status"><option value="">All statuses</option><option value="available">Available</option><option value="home">Gone home</option></select></label>' +
    '<button type="reset" class="secondary">Reset filters</button></form><p id="count" role="status"></p><div id="results" class="grid"></div>';
  const form = document.querySelector('#filters');
  for (const name of ['q','breed','location','status']) form.elements[name].value = params.get(name) ?? '';
  function update(sync = true) {
    const filters = new FormData(form);
    const query = String(filters.get('q')).trim().toLowerCase();
    const results = puppies.filter(p => (p.name + ' ' + p.breed).toLowerCase().includes(query) &&
      ['breed','location','status'].every(key => !filters.get(key) || filters.get(key) === p[key]));
    document.querySelector('#count').textContent = results.length + (results.length === 1 ? ' puppy found' : ' puppies found');
    document.querySelector('#results').innerHTML = results.length ? photos(results) : '<p>Try another search or reset the filters.</p>';
    if (sync) {
      const active = new URLSearchParams([...filters].filter(([,value]) => value));
      history.replaceState(null, '', '#puppies' + (active.size ? '?' + active : ''));
    }
  }
  form.addEventListener('input', () => update());
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('reset', event => {
    event.preventDefault();
    for (const name of ['q', 'breed', 'location', 'status']) form.elements[name].value = '';
    update();
  });
  update(false);
}

function profile(p) {
  gallery = [p];
  return '<a class="back" href="#puppies">Back to the catalog</a><div class="split profile"><div class="gallery"><button data-photo="0"><img src="' +
    image(p.image) + '" alt="' + p.breed + ' puppy"><span>View photo</span></button></div><div><span class="pill">' +
    (p.status === 'home' ? 'Gone home' : p.location) + '</span><h1>' + p.name + '</h1><p>' + p.breed + ' · ' +
    p.sex + ' · ' + p.age + '</p><p>' + p.note + '</p><p>Illustrative profile and image.</p>' +
    (p.status === 'available' ? button('visit?puppy=' + p.id,'Enquire about ' + p.name) : button('puppies?status=available','Browse available puppies')) +
    '</div></div>';
}

function families() {
  gallery = puppies.filter(p => p.status === 'home');
  return intro('Happy families','Explore the sample gallery of puppies who have already gone home.') +
    '<div class="grid gallery">' + gallery.map((p,i) => '<button class="card" data-photo="' + i +
      '"><img src="' + image(p.image) + '" alt="' + p.breed + ' puppy"><span>' + p.name + ' · Gone home</span></button>').join('') + '</div>';
}

function visit(params) {
  const p = puppies.find(item => item.id === params.get('puppy'));
  main.innerHTML = intro('Plan a visit','Prepare an enquiry for a showroom visit or an imported puppy.') +
    '<div class="split"><aside class="panel"><h2>Dubai showroom</h2><p>Choose a topic and tell us what you’d like to know. This demo locally previews your message.</p>' +
    '<a href="https://www.google.com/maps/search/?api=1&query=Downtown+Dubai" target="_blank" rel="noopener noreferrer">Explore Downtown Dubai on Google Maps</a></aside>' +
    '<form id="visit-form"><label>Your name<input name="name" autocomplete="name" required maxlength="80"></label><label>Email<input type="email" name="email" autocomplete="email" required maxlength="160"></label>' +
    '<label>Topic<select name="topic"><option>Showroom visit</option><option>Import enquiry</option><option>General question</option></select></label>' +
    '<label>Message<textarea name="message" rows="4" required maxlength="500">' + (p ? 'I’d like to ask about ' + p.name + '.' : '') +
    '</textarea></label><button>Preview enquiry</button><div id="confirmation" role="status"></div></form></div>';
  const form = document.querySelector('#visit-form');
  if (p?.location === 'Import enquiry') form.elements.topic.value = 'Import enquiry';
  const confirmation = document.querySelector('#confirmation');
  form.addEventListener('input', () => { confirmation.textContent = ''; });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const fields = new FormData(form);
    const heading = document.createElement('strong');
    heading.textContent = 'Enquiry preview · Saved on this screen only';
    const preview = document.createElement('p');
    preview.textContent = fields.get('name') + ' (' + fields.get('email') + ') · ' +
      fields.get('topic') + ' · ' + fields.get('message');
    confirmation.replaceChildren(heading, preview);
  });
}

const pages = {
  home,
  families,
  process: () => intro('How it works','From browsing a profile to getting ready for collection.') +
    '<div class="grid"><article class="panel"><h3>Explore breeds</h3><p>Consider size, activity and grooming needs. Choose a profile that suits your routine.</p></article><article class="panel"><h3>Ask for details</h3><p>Request current photos and copies of the veterinary records. Ask whether a showroom visit is possible.</p></article><article class="panel"><h3>Arrange collection</h3><p>Confirm the date, care instructions and paperwork before collection or delivery.</p></article></div><div class="actions">' +
    button('puppies','Browse puppies') + button('delivery','Delivery & collection',true) + '</div>',
  faq: () => intro('Frequently asked questions','What to know before meeting a puppy.') + accordion(questions),
  delivery: () => intro('Delivery & collection','Prepare for your puppy’s trip home.') +
    '<div class="split"><article class="panel"><h3>Showroom collection</h3><p>Agree on a pickup time and ask for the vaccination record, microchip details and feeding schedule.</p></article><article class="panel alt"><h3>Imported puppies</h3><p>Confirm expected timing, travel paperwork, destination and handover arrangements with your provider.</p></article></div><div class="actions">' + button('visit','Prepare an enquiry') + '</div>',
};

function closeMenu() {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}

function render(moveFocus = false) {
  const [path, query] = location.hash.slice(1).split('?');
  const route = path || 'home';
  if (route === 'main') return;
  const params = new URLSearchParams(query);
  if (dialog.open) dialog.close();
  gallery = [];
  const puppy = route.startsWith('puppy/') && puppies.find(p => p.id === route.slice(6));
  if (route === 'puppies') catalog(params);
  else if (route === 'visit') visit(params);
  else main.innerHTML = puppy ? profile(puppy) : Object.hasOwn(pages, route) ? pages[route]() :
    intro('Page not found','Try the catalog to find a puppy profile.') + button('puppies','Browse puppies');
  const title = main.querySelector('h1').textContent;
  document.title = route === 'home' ? 'Little Paws Dubai' : title + ' | Little Paws Dubai';
  for (const link of nav.querySelectorAll('a')) {
    if (link.hash === '#' + route || (puppy && link.hash === '#puppies')) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  closeMenu();
  if (moveFocus) {
    main.focus({preventScroll:true});
    window.scrollTo(0,0);
  }
}

function showPhoto(index) {
  photoIndex = (index + gallery.length) % gallery.length;
  const p = gallery[photoIndex];
  const picture = dialog.querySelector('img');
  picture.src = image(p.image);
  picture.alt = p.breed + ' puppy';
  dialog.querySelector('#caption').textContent = p.name + ' · ' + p.breed;
  dialog.querySelectorAll('[data-step]').forEach(control => { control.hidden = gallery.length < 2; });
}

menu.addEventListener('click', () => menu.setAttribute('aria-expanded', String(nav.classList.toggle('open'))));
document.querySelector('.skip').addEventListener('click', event => {
  event.preventDefault();
  main.focus();
});
main.addEventListener('click', event => {
  const trigger = event.target.closest('[data-photo]');
  if (!trigger) return;
  photoTrigger = trigger;
  showPhoto(Number(trigger.dataset.photo));
  dialog.showModal();
});
dialog.addEventListener('close', () => photoTrigger?.focus());
dialog.addEventListener('click', event => {
  if (event.target.id === 'close-photo' || event.target === dialog) dialog.close();
  const step = event.target.closest('[data-step]');
  if (step) showPhoto(photoIndex + Number(step.dataset.step));
});
window.addEventListener('hashchange', () => render(true));
render();
