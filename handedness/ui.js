var el = document.getElementsByClassName('item')[0];
var mock = el.outerHTML;

el.parentNode.removeChild(el);

var html = '';
for(let i = 0; i < 50; i++){
    let this_mock = mock;
    this_mock = this_mock.split('{{name}}').join(faker.name.findName());
    this_mock = this_mock.split('{{date}}').join(moment(faker.date.past()).format('LL'));
    this_mock = this_mock.split('{{image}}').join(faker.image.avatar());
    html += this_mock;
}

document.body.innerHTML = html;