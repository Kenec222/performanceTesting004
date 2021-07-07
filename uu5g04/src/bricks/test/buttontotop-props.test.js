/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

import UU5 from "uu5g04";
import "uu5g04-bricks";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.ColorSchema",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    icon: {
      values: ["mdi-menu", "mdi-chevron-up"],
    },
    offset: {
      values: [150, 3000],
    },
    scrollDuration: {
      values: [800, 3000],
    },
    size: {
      values: ["s", "m", "l", "xl"],
    },
    bgStyle: {
      values: ["filled", "outline", "transparent"],
    },
  },
  requiredProps: {},
  opt: {},
};

describe(`UU5.Bricks.ButtonToTop props testing`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.ButtonToTop, CONFIG);
});
