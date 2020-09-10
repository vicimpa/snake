import React from "react";
import { render } from "react-dom";
import { MainComponent } from "components/Main";

import  "./index.sass";

const root = document.getElementById('root')
render(<MainComponent width={20} height={20}/>, root)