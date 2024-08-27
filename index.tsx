import  "./index.sass";

import { MainComponent } from "components/Main";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById('root'))
  .render(<MainComponent width={20} height={20} />)