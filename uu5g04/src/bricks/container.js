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

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import { InlineMode } from "./internal/inline-mode.js";

const EditableContainer = UU5.Common.Component.lazy(async () => {
  await SystemJS.import("uu5g04-forms");
  await SystemJS.import("uu5g04-bricks-editable");
  return import("./internal/container-editable.js");
});

let editationLazyLoaded = false;

import "./container.less";
import Lsi from "./bricks-lsi.js";
//@@viewOff:imports

let Container = UU5.Common.VisualComponent.create({
  displayName: "Container", // for backward compatibility (test snapshots)

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.SectionMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.EditableMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Container"),
    nestingLevelList: UU5.Environment.getNestingLevelList("container", "bigBoxCollection"),
    classNames: {
      main: ns.css("container"),
      spacing: ns.css("container-spacing"),
      noSpacing: ns.css("container-nospacing"),
      editation: ns.css("container-editation"),
    },
    editMode: {
      name: Lsi.inlineComponentHeaders.containerName,
      enablePlaceholder: true,
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    noSpacing: UU5.PropTypes.bool,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      noSpacing: false,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      editationLazyLoaded: false,
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  onBeforeForceEndEditation_() {
    return this._editableContainer ? this._editableContainer.getPropsToSave() : undefined;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _getMainAttrs() {
    let mainAttrs = this.getMainAttrs();
    mainAttrs.className += " " + this.getClassName(this.props.noSpacing ? "noSpacing" : "spacing");
    if (this.state.editation) {
      mainAttrs.className += ` ${this.getClassName("editation")}`;
    }
    return mainAttrs;
  },

  _registerNull(inst) {
    // unmount of component means that suspense is loaded and component should be rendered
    if (!inst) {
      this.setState((state) => {
        if (state.editationLazyLoaded) return;

        // Edit component is loaded - need to set to static variable because other Edit component does not render fallback component
        // editationLazyLoaded is stored in both state and static variable for cases such as when more edit modes are loaded at the same time
        editationLazyLoaded = true;
        return { editationLazyLoaded: true };
      });
    }
  },

  _isEditationLazyLoaded() {
    return editationLazyLoaded;
  },

  _renderEditationMode(inline = false) {
    return (
      <UU5.Common.Suspense fallback={<span ref={this._registerNull} />}>
        <EditableContainer
          inline={inline}
          level={this.getLevel()}
          component={this}
          ref_={this._registerEditableContainer}
        />
      </UU5.Common.Suspense>
    );
  },

  _registerEditableContainer(container) {
    this._editableContainer = container;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this.getNestingLevel() ? (
      <div {...this._getMainAttrs()}>
        {this.state.editation ? this._renderEditationMode() : null}
        {!this.state.editation || !this._isEditationLazyLoaded()
          ? [this.getHeaderChild(), this.getChildren(), this.getFooterChild(), this.getDisabledCover()]
          : null}
      </div>
    ) : (
      <InlineMode
        component={this}
        Component={UU5.Bricks.Container}
        modalHeader={this.props.header || <UU5.Bricks.Lsi lsi={Lsi.inlineComponentHeaders.containerName} />}
        editModalHeader={<UU5.Bricks.Lsi lsi={Lsi.inlineComponentHeaders.containerEditHeader} />}
        linkTitle={this.props.header || <UU5.Bricks.Lsi lsi={Lsi.inlineComponentHeaders.containerName} />}
        getPropsToSave={this.onBeforeForceEndEditation_}
        renderEditationMode={this._renderEditationMode}
      />
    );
  },
  //@@viewOff:render
});

export { Container };
export default Container;
