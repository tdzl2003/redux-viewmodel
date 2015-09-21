/**
 * Created by tdzl2_000 on 2015-08-28.
 */

import React from 'react';
import {Provider} from 'redux-viewmodel';
import RootViewModel from './viewmodels/root';
import AppView from "./views/app";

var rootViewModel = new RootViewModel();
React.render((
    <Provider viewModel={rootViewModel} viewClass={AppView} />
), document.body);
