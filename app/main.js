import './style.css';
import { navegation,navegationTag} from './router.js';


document.addEventListener('DOMContentLoaded', () => {
  navegation(location.pathname); 
  navegationTag();               
});