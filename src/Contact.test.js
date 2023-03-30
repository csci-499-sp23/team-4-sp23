import renderer from 'react-test-renderer';
import Contact from './components/pages/Contact.js';

it('renders correctly',() => {
    const tree = renderer
    .create(<Contact page = 'https://wheel-call-you-9b6ca.firebaseapp.com/contact'>Contact Us</Contact>)
    .toJSON();
    expect(tree).toMatchSnapshot();
})