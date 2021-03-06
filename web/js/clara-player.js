/**
 * Copyright © Exocortex, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define(
  ["jquery", "claraplayer", "jquery/ui", "Magento_Customer/js/customer-data"],
  function($, claraPlayer, ui, customerData) {
    "use strict";
    window.claraplayer = claraPlayer;

    $.widget("clara.player", {
      options: {
        optionConfig: null,
        sceneId: "1baf8c9e-a49a-4136-a78f-055f9430a48b"
      },

      configType: null,

      configMap: null,

      _init: function() {},

      _create: function() {
        var self = this;
        require(["js/main"], function() {
          //map configuration options with magento2 attributes
          var options = window.weeversConfig.boxConfiguration;
          self.configMap = self._mappingConfiguration(
            options,
            self.options.optionConfig
          );
          self.configType = self._createConfigType(options);
          self._createFormFields(self.options.optionConfig.options);

          //Add event handler to update magento fields when configurations change
          window.addEventListener("updateWeevers", function() {
            const boxConfig = window.weeversConfig.box;
            const updateOptions = {
              "Box Type": boxConfig.type,
              "Box Length": boxConfig.scale.x,
              "Box Width": boxConfig.scale.y,
              "Box Depth": boxConfig.scale.z
            };

            self._updateFormFields(
              updateOptions,
              self.configMap,
              self.configType,
              []
            );
          });

          //Add event handler to post order to mythreekit when adding the product to cart.
          $("#product_addtocart_form").on("submit", function(e) {
            e.preventDefault();
            var self = this;
            const uri =
              "https://mythreekit.com/api/organizations/weevers/orders";
            const boxConfig = window.weeversConfig.box;
            const customer = customerData.get("customer");
            const productInfo = {
              productId: "59763504976bd8000192866b",
              sceneId: "1baf8c9e-a49a-4136-a78f-055f9430a48b",
              configuration: {
                "Box Type": boxConfig.type,
                "Box Length": boxConfig.scale.x,
                "Box Width": boxConfig.scale.y,
                "Box Depth": boxConfig.scale.z
              },
              customer: {
                email: "annon@example.com",
                name: (customer() && customer().fullname) || "no session"
              }
            };
            fetch(uri, {
              method: "POST",
              headers: new Headers({
                "Content-Type": "application/json"
              }),
              body: JSON.stringify(productInfo)
            }).then(function(err) {
              $("#product_addtocart_form").unbind("submit").submit();
            });
          });

          //update form with default configurations.
          const defaultConfig = {
            "Box Type": "Standard",
            "Box Length": 80,
            "Box Width": 60,
            "Box Depth": 80
          };
          self._updateFormFields(
            defaultConfig,
            self.configMap,
            self.configType,
            []
          );
        });
      },

      _createConfigType: function createConfigType(claraConfig) {
        var configType = new Map();
        for (var key in claraConfig) {
          configType.set(claraConfig[key].name, claraConfig[key].type);
        }
        return configType;
      },

      _initForm: function(options) {
        var wrapper = document.getElementById(
          "clara-form-configurations-wrapper"
        );
        if (!wrapper) {
          console.error("Can not find clara configuration wrapper");
          return;
        }
        // check if the fields are already created
        if (wrapper.hasChildNodes()) {
          console.warn("Form fields already exist");
          return;
        }

        // insert input fields
        console.log("Making custom configurator...");
        var formFields = document.createElement("div");
        var optionCounter = 1;
        var selectionCounter = 1;
        for (var key in options) {
          // add div
          var optionEI = document.createElement("input");
          var optionQtyEI = document.createElement("input");

          // set option name and leave default value empty
          optionEI.setAttribute("name", "bundle_option[" + key + "]");
          optionEI.setAttribute("id", "bundle_option[" + key + "]");
          optionEI.setAttribute("value", "");
          optionEI.setAttribute("type", "hidden");
          // set option quantity
          optionQtyEI.setAttribute("name", "bundle_option_qty[" + key + "]");
          optionQtyEI.setAttribute("id", "bundle_option_qty[" + key + "]");
          optionQtyEI.setAttribute("value", "");
          optionQtyEI.setAttribute("type", "hidden");
          // append to form
          formFields.appendChild(optionEI);
          formFields.appendChild(optionQtyEI);
        }
        wrapper.appendChild(formFields);
        console.log("done");
      },

      _createFormFields(options) {
        // locate the form div
        var wrapper = document.getElementById(
          "clara-form-configurations-wrapper"
        );
        if (!wrapper) {
          console.error("Can not find clara configuration wrapper");
          return;
        }
        // check if the fields are already created
        if (wrapper.hasChildNodes()) {
          console.warn("Form fields already exist");
          return;
        }

        // insert input fields
        console.log("Making custom configurator...");
        var formFields = document.createElement("div");
        var optionCounter = 1;
        var selectionCounter = 1;
        for (var key in options) {
          // add div
          var optionEI = document.createElement("input");
          var optionQtyEI = document.createElement("input");

          // set option name and leave default value empty
          optionEI.setAttribute("name", "bundle_option[" + key + "]");
          optionEI.setAttribute("id", "bundle_option[" + key + "]");
          optionEI.setAttribute("value", "");
          optionEI.setAttribute("type", "hidden");
          // set option quantity
          optionQtyEI.setAttribute("name", "bundle_option_qty[" + key + "]");
          optionQtyEI.setAttribute("id", "bundle_option_qty[" + key + "]");
          optionQtyEI.setAttribute("value", "");
          optionQtyEI.setAttribute("type", "hidden");
          // append to form
          formFields.appendChild(optionEI);
          formFields.appendChild(optionQtyEI);
        }
        wrapper.appendChild(formFields);
        console.log("done");
      },

      _mappingConfiguration: function mappingConfiguration(
        claraCon,
        magentoCon
      ) {
        var claraKey = new Map();
        var claraSelectionKey = new Map();
        claraSelectionKey.set("keyInParent", "values");
        claraSelectionKey.set("type", "array");
        claraKey.set("key", "name");
        claraKey.set("type", "object");
        claraKey.set("nested", claraSelectionKey);

        var magentoKey = new Map();
        var magentoSelectionKey = new Map();
        magentoSelectionKey.set("keyInParent", "selections");
        magentoSelectionKey.set("type", "object");
        magentoSelectionKey.set("matching", "endsWith");
        magentoSelectionKey.set("key", "name");
        magentoKey.set("key", "title");
        magentoKey.set("type", "object");
        magentoKey.set("matching", "exactly");
        magentoKey.set("nested", magentoSelectionKey);

        var map = this._reverseMapping(
          magentoCon.options,
          magentoKey,
          claraCon,
          claraKey
        );
        if (!map) {
          console.error("Auto mapping clara configuration with magento failed");
          return null;
        }
        return map;
      },

      _reverseMapping: function reverseMapping(
        primary,
        primaryKey,
        target,
        targetKey
      ) {
        // result (using ES6 map)
        var map = new Map();
        // save the values in target that already find a matching, to ensure 1-to-1 mapping
        var valueHasMapped = new Map();

        // complexity = o(n^2), could be reduced to o(nlog(n))
        for (var pKey in primary) {
          var primaryValue =
            primaryKey.get("type") === "object"
              ? primary[pKey][primaryKey.get("key")]
              : primary[pKey];
          if (!primaryValue) {
            console.error("Can not read primaryKey from primary");
            return null;
          }
          // search for title in claraCon
          var foundMatching = false;
          for (var tKey in target) {
            var targetValue =
              targetKey.get("type") === "object"
                ? target[tKey][targetKey.get("key")]
                : target[tKey];
            if (!targetValue) {
              console.error("Can not read  targetKey from target");
              return null;
            }
            if (
              typeof primaryValue !== "string" ||
              typeof targetValue !== "string"
            ) {
              console.error(
                "Primary or target attribute value is not a string"
              );
              return null;
            }
            var matching = false;
            if (primaryKey.get("matching") === "exactly") {
              matching = primaryValue === targetValue;
            } else if (primaryKey.get("matching") === "endsWith") {
              matching = primaryValue.endsWith(targetValue);
            }
            if (matching) {
              if (valueHasMapped.has(targetValue)) {
                console.error(
                  "Found target attributes with same name, unable to perform auto mapping"
                );
                return null;
              }
              // find a match
              valueHasMapped.set(targetValue, true);
              var mappedValue = new Map();
              mappedValue.set("key", pKey);
              // recursively map nested object until primaryKey and targetKey have no 'nested' key
              if (primaryKey.has("nested") && targetKey.has("nested")) {
                var childMap = null;
                switch (target[tKey].type) {
                  case "Number":
                    childMap = [primaryValue];
                    break;
                  case "Options":
                    childMap =
                      target[tKey][targetKey.get("nested").get("keyInParent")];
                    break;
                  case "Boolean":
                    childMap = ["true", "false"];
                    break;
                  case "Color":
                    break;
                }
                var nestedMap = reverseMapping(
                  primary[pKey][primaryKey.get("nested").get("keyInParent")],
                  primaryKey.get("nested"),
                  childMap,
                  targetKey.get("nested")
                );
                mappedValue.set(
                  targetKey.get("nested").get("keyInParent"),
                  nestedMap
                );
              }
              map.set(targetValue, mappedValue);
              foundMatching = true;
              break;
            }
          }
          if (!foundMatching) {
            console.warn(
              "Can not find primary value " + primaryValue + " in target config"
            );
          }
        }

        // check all target to see if all target value has been mapped
        for (var tKey in target) {
          var targetValue =
            targetKey.get("type") === "object"
              ? target[tKey][targetKey.get("key")]
              : target[tKey];
          if (!valueHasMapped.has(targetValue)) {
            console.warn(
              "Target value " + targetValue + " has not been mapped!"
            );
          }
        }
        return map;
      },

      _updateFormFields: function updateFormFields(
        config,
        map,
        configType,
        dimensions
      ) {
        var volume = 1;
        for (var attr in config) {
          if (map.has(attr)) {
            var attrId = map.get(attr).get("key");
            switch (configType.get(attr)) {
              case "Number":
                // update number
                if (dimensions.includes(attr)) {
                  volume = config[attr] * volume;
                }
                var attrValue = map
                  .get(attr)
                  .get("values")
                  .get(attr)
                  .get("key");
                document
                  .getElementById("bundle_option[" + attrId + "]")
                  .setAttribute("value", attrValue);
                document
                  .getElementById("bundle_option_qty[" + attrId + "]")
                  .setAttribute("value", config[attr]);
                break;
              case "Options":
                // update options
                // choose from leather or fabric
                var attrValue = map
                  .get(attr)
                  .get("values")
                  .get(config[attr])
                  .get("key");
                document
                  .getElementById("bundle_option[" + attrId + "]")
                  .setAttribute("value", attrValue);
                document
                  .getElementById("bundle_option_qty[" + attrId + "]")
                  .setAttribute("value", "1");
                break;
              case "Boolean":
                // update boolean
                var attrValue = map
                  .get(attr)
                  .get("values")
                  .get(config[attr].toString())
                  .get("key");
                document
                  .getElementById("bundle_option[" + attrId + "]")
                  .setAttribute("value", attrValue);
                document
                  .getElementById("bundle_option_qty[" + attrId + "]")
                  .setAttribute("value", "1");
                break;
              case "Color":
                break;
            }
          } else {
            console.warn(attr + " not found in config map");
          }
        }
        // update volume price
        // var materialPrice =
        //   config["Cover Material"] === "Leather"
        //     ? "Leather_Price"
        //     : "Fabric_Price";
        // var volumeId = map.get("Volume_Price").get("key");
        // var volumeValue = map
        //   .get("Volume_Price")
        //   .get("values")
        //   .get(materialPrice)
        //   .get("key");
        // document
        //   .getElementById("bundle_option[" + volumeId + "]")
        //   .setAttribute("value", volumeValue);
        // document
        //   .getElementById("bundle_option_qty[" + volumeId + "]")
        //   .setAttribute("value", volume);
      }
    });
    return $.clara.player;
  }
);

