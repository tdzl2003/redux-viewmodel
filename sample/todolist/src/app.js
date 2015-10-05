/**
 * Created by tdzl2_000 on 2015-08-28.
 */

import React from 'react';
import {Provider} from 'redux-viewmodel';
import RootViewModel from './viewmodels/root';
import AppView from "./views/app";

React.render((
    <Provider viewModel={RootViewModel.instance} viewClass={AppView} />
), document.body);
