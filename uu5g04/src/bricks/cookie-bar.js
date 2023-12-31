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

import { Div } from "./factory.js";
import Span from "./span.js";
import Link from "./link.js";
import Button from "./button.js";
import Icon from "./icon.js";

import "./cookie-bar.less";
import Lsi from "./lsi.js";
import lsi from "./bricks-lsi.js";
//@@viewOff:imports

export const CookieBar = UU5.Common.VisualComponent.create({
  displayName: "CookieBar", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.PureRenderMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("CookieBar"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("cookie-bar uu5-common-bg"),
      top: ns.css("cookie-bar-top"),
      bottom: ns.css("cookie-bar-bottom"),
      button: ns.css("cookie-bar-button"),
      link: ns.css("cookie-bar-link"),
      controls: ns.css("cookie-bar-controls"),
    },
    defaults: {
      content:
        "Cookies help us to provide, protect and improve our services. By viewing this site, you agree to their use.",
      expireDays: 365,
    },
    opt: {
      nestingLevelRoot: true,
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    infoText: UU5.PropTypes.any,
    infoHref: UU5.PropTypes.string,
    infoTarget: UU5.PropTypes.oneOf(["_blank", "_parent", "_top", "_self"]),
    fixed: UU5.PropTypes.oneOf(["top", "bottom"]),
    onClose: UU5.PropTypes.func,
    expireDays: UU5.PropTypes.number,
    cookieKey: UU5.PropTypes.string,
    cookieValue: UU5.PropTypes.string,
    agreedText: UU5.PropTypes.node,
    agreedBgStyle: UU5.PropTypes.string,
    agreedColorSchema: UU5.PropTypes.string,
    closedText: UU5.PropTypes.node,
    closedBgStyle: UU5.PropTypes.string,
    closedColorSchema: UU5.PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      infoText: null,
      infoHref: null,
      infoTarget: "_blank",
      fixed: "bottom",
      onClose: null,
      expireDays: null,
      cookieKey: "uu5-cookies",
      cookieValue: "yes",
      agreedText: undefined,
      agreedBgStyle: "transparent",
      agreedColorSchema: undefined,
      closedText: undefined,
      closedBgStyle: undefined,
      closedColorSchema: "default",
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  UNSAFE_componentWillMount() {
    this.props.expireDays ? this._checkCookies() : this._checkLocalStorageItem();
  },

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.props.expireDays ? this._checkCookies(nextProps) : this._checkLocalStorageItem(nextProps);
  },
  //@@viewOff:reactLifeCycle

  // Interface

  // Overriding Functions

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _checkCookies(props = this.props) {
    if (UU5.Common.Tools.getCookie(props.cookieKey) === props.cookieValue && !this._isAgreed) {
      this._isAgreed = true;
      this.setState({ hidden: true }, props.onClose);
    }
    return this;
  },

  _checkLocalStorageItem(props = this.props) {
    const item = localStorage && localStorage.getItem(props.cookieKey);
    if (item === props.cookieValue) {
      this.setState({ hidden: true }, props.onClose);
    }
    return this;
  },

  _setLocalStorageItem() {
    localStorage && localStorage.setItem(this.props.cookieKey, this.props.cookieValue);
    this.hide(this.props.onClose);
  },

  _confirm() {
    UU5.Common.Tools.setCookie(
      this.props.cookieKey,
      this.props.cookieValue,
      this.props.expireDays || this.getDefault().expireDays
    );
    this.hide(this.props.onClose);
  },

  _getText() {
    let content = this.getContent();

    if (!content && !this.props.children) {
      content = this.getDefault().content;
    }

    return <Span content={content}>{this.props.children && UU5.Common.Children.toArray(this.props.children)}</Span>;
  },

  _getLink() {
    var link = null;

    if (this.props.infoText) {
      // href -> linkHref || undefined -> if undefined, default prop of link is set - other way, null is set
      link = (
        <Link
          content={this.props.infoText}
          href={this.props.infoHref || undefined}
          className={this.getClassName().link}
          target={this.props.infoTarget}
          colorSchema="default"
        />
      );
    }

    return link;
  },

  _getMainProps() {
    var mainProps = this.getMainPropsToPass(["UU5.Common.BaseMixin", "UU5.Common.ElementaryMixin"]);
    this.props.fixed && (mainProps.className += " " + this.getClassName(this.props.fixed));

    mainProps.nestingLevel = this.getNestingLevel();

    return mainProps;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <Div {...this._getMainProps()}>
        <div>
          {this._getText()}
          {this._getLink()}
        </div>
        <div className={this.getClassName("controls")}>
          <Button
            className={this.getClassName("button")}
            bgStyle={this.props.agreedBgStyle}
            colorSchema={this.props.agreedColorSchema || (this.props.colorSchema !== "black" ? "custom" : null)}
            onClick={this.props.expireDays ? this._confirm : this._setLocalStorageItem}
          >
            {this.props.agreedText || <Icon icon="mdi-close" />}
          </Button>
          {this.props.agreedText ? (
            <Button
              className={this.getClassName("button")}
              bgStyle={this.props.closedBgStyle}
              colorSchema={this.props.closedColorSchema}
              onClick={() => this.hide(this.props.onClose)}
            >
              {this.props.closedText || <Lsi lsi={lsi.cookieBar.close} />}
            </Button>
          ) : null}
        </div>
      </Div>
    );
  },
  //@@viewOff:render
});

export default CookieBar;
