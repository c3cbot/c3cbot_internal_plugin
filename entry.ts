import * as NOCOM_AType from "@nocom_bot/nocom-atype-support";
import "@nocom_bot/types_ts_plugin_a1";

NOCOM_AType.verifyPlugin(true);

await NOCOM_AType.registerCommand("shutdown", {
  args: {
    fallback: ""
  },
  argsName: [],
  description: {
    fallback: "Shutdown C3CBot",
    "en-US": "Shutdown C3CBot",
    "vi": "Tắt C3CBot",
    "ja": "C3CBotをシャットダウンする"
  }
}, async data => {
  // Check if the user is the operator of this bot.
  let operatorList = await NOCOM_AType.callAPI("core", "get_operator_list", null);
  if (operatorList.indexOf(data.formattedSenderID) + 1) {
    setTimeout(() => {
      NOCOM_AType.callAPI("core", "shutdown_core", null);
    }, 1000);
    return {
      content:
        data.language === "vi" ? "Đang tiến hành tắt C3CBot..." :
          data.language === "ja" ? "C3CBotをシャットダウンしています..." :
            "Shutting down C3CBot...",
      attachments: []
    };
  } else {
    return {
      content:
        data.language === "vi" ? "Bạn không phải là người điều khiển bot này." :
          data.language === "ja" ? "あなたはこのbotのオペレーターではありません。" :
            "You are not the operator of this bot.",
      attachments: []
    }
  }
}, []);

await NOCOM_AType.registerCommand("restart", {
  args: {
    fallback: ""
  },
  argsName: [],
  description: {
    fallback: "Restart C3CBot",
    "en-US": "Restart C3CBot",
    "vi": "Khởi động lại C3CBot",
    "ja": "C3CBotを再起動する"
  }
}, async data => {
  // Check if the user is the operator of this bot.
  let operatorList = await NOCOM_AType.callAPI("core", "get_operator_list", null);
  if (operatorList.indexOf(data.formattedSenderID) + 1) {
    setTimeout(() => {
      NOCOM_AType.callAPI("core", "restart_core", null);
    }, 1000);
    return {
      content:
        data.language === "vi" ? "Đang tiến hành khởi động lại C3CBot..." :
          data.language === "ja" ? "C3CBotを再起動しています..." :
            "Restarting C3CBot...",
      attachments: []
    };
  } else {
    return {
      content:
        data.language === "vi" ? "Bạn không phải là người điều khiển bot này." :
          data.language === "ja" ? "あなたはこのbotのオペレーターではありません。" :
            "You are not the operator of this bot.",
      attachments: []
    }
  }
}, []);

await NOCOM_AType.registerCommand("lang", {
  args: {
    fallback: "<IETF language tag>",
    "en-US": "<IETF language tag>",
    "vi": "<Mã ngôn ngữ IETF>",
    "ja": "<IETF言語タグ>"
  },
  argsName: ["language"],
  description: {
    fallback: "Change the language you want to use.",
    "en-US": "Change the language you want to use.",
    "vi": "Thay đổi ngôn ngữ bạn muốn sử dụng.",
    "ja": "使用する言語を変更します。"
  }
}, async data => {
  let lang = data.args[0];
  if (lang) {
    if (data.language === lang) {
      return {
        content:
          data.language === "vi" ? "Bạn đã đang sử dụng ngôn ngữ này." :
            data.language === "ja" ? "あなたはすでにこの言語を使用しています。" :
              "You are already using this language.",
        attachments: []
      };
    } else {
      // Find command handler and set language there.
      let installedModules = (await NOCOM_AType.callAPI("core", "get_registered_modules", {})) as {
        moduleID: string,
        type: string,
        namespace: string,
        displayname: string,
        running: boolean
      }[];
      let commandHandler = installedModules.find(module => module.type === "cmd_handler");
      if (commandHandler) {
        let response = (await NOCOM_AType.callAPI(commandHandler.moduleID, "set_lang", {
          formattedUserID: data.formattedSenderID,
          language: lang
        })) as { success: boolean };

        if (response?.success) {
          return {
            content:
              lang === "vi" ? "Đã thay đổi ngôn ngữ thành " + lang + "." :
                lang === "ja" ? lang + "に言語を変更しました。" :
                  "Language changed to " + lang + ".",
            attachments: []
          };
        } else {
          return {
            content:
              data.language === "vi" ? "Không thể thay đổi ngôn ngữ (lỗi cmd_handler)." :
                data.language === "ja" ? "言語を変更できません（cmd_handlerエラー）。" :
                  "Cannot change language (cmd_handler error).",
            attachments: []
          };
        }
      } else {
        return {
          content: "(UNKNOWN BUG) Command handler not found.",
          attachments: []
        }
      }
    }
  } else {
    return {
      content:
        // Display language with their language code.
        data.language === "vi" ? "Ngôn ngữ hiện tại của bạn là Tiếng Việt (vi)." :
          data.language === "ja" ? "あなたの現在の言語は日本語（ja）です。" :
            data.language.startsWith("en") ? `Your current language is English (${data.language}).` :
              "Your current language is " + data.language + ".",
      attachments: []
    }
  }
}, []);

await NOCOM_AType.registerCommand("version", {
  args: {
    fallback: ""
  },
  argsName: [],
  description: {
    fallback: "Get the version of C3CBot.",
    "en-US": "Get the version of C3CBot.",
    "vi": "Lấy phiên bản của C3CBot.",
    "ja": "C3CBotのバージョンを取得します。"
  }
}, async data => {
  return {
    content: `C3CBot v1.0.0-alpha.1`,
    attachments: []
  };
}, []);

await NOCOM_AType.registerCommand("help", {
  args: {
    fallback: "[command/page number]",
    "en-US": "[command/page number]",
    "vi": "[lệnh/số trang]",
    "ja": "[コマンド/ページ番号]"
  },
  argsName: ["commandorpageno"],
  description: {
    fallback: "Get help for a command or a page of commands.",
    "en-US": "Get help for a command or a page of commands.",
    "vi": "Lấy trợ giúp cho một lệnh hoặc một trang lệnh.",
    "ja": "コマンドまたはコマンドのページのヘルプを取得します。"
  }
}, async data => {
  // Get command handler.
  let installedModules = (await NOCOM_AType.callAPI("core", "get_registered_modules", {})) as {
    moduleID: string,
    type: string,
    namespace: string,
    displayname: string,
    running: boolean
  }[];

  let commandHandler = installedModules.find(module => module.type === "cmd_handler");
  if (commandHandler) {
    let commandList = (await NOCOM_AType.callAPI(commandHandler.moduleID, "cmd_list", {})) as {
      commands: {
        namespace: string,
        command: string,
        funcName: string,
        description: {
          fallback: string,
          [ISOLanguageCode: string]: string
        },
        args: {
          fallback: string,
          [ISOLanguageCode: string]: string
        },
        argsName?: string[],
        compatibilty: string[]
      }[],
      count: number
    };

    let pageNumber = 0;
    let command = data.args[0];
    if (command) {
      // If command match a registered command, display help for that command,
      // otherwise interpret it as a page number.
      // If page number is invalid, display help for page 1.
      let commandData = commandList.commands.find(cmd => cmd.command === command);
      if (commandData) {
        // Display help for command.
        return {
          content:
            `/${commandData.command} ${commandData.args[data.language] || commandData.args.fallback}` + "\n\n" +
            (commandData.description[data.language] || commandData.description.fallback),
          attachments: []
        }
      } else {
        // Interpret as page number.
        pageNumber = parseInt(command);
        if (isNaN(pageNumber)) {
          // Display help for page 1, since input page is invalid.
          pageNumber = 1;
        }
      }
    } else {
      // Display help for page 1.
      pageNumber = 1;
    }

    // Print 20 commands per page, without description or args.
    // Sort commands alphabetically.
    let commands = commandList.commands.sort((a, b) => a.command.localeCompare(b.command));
    let page = commands.slice((pageNumber - 1) * 20, pageNumber * 20);
    return {
      content: `${
        data.language === "vi" ? `Danh sách lệnh (trang ${pageNumber}/${Math.ceil(commands.length / 20)}):` :
          data.language === "ja" ? `コマンドリスト（ページ${pageNumber}/${Math.ceil(commands.length / 20)}）：` :
            `Command list (page ${pageNumber}/${Math.ceil(commands.length / 20)}):`
      }\n\n${page.map(cmd => `\`/${cmd.command}\``).join(" ")}`,
      attachments: []
    }
  } else {
    return {
      content: "(UNKNOWN BUG) Command handler not found.",
      attachments: []
    }
  }
}, []);

await NOCOM_AType.registerCommand("ping", {
  args: {
    fallback: ""
  },
  argsName: [],
  description: {
    fallback: "Ping the bot.",
    "en-US": "Ping the bot.",
    "vi": "Ping bot.",
    "ja": "ボットにPingします。"
  }
}, async data => {
  return {
    content: "Pong!",
    attachments: []
  };
}, []);

await NOCOM_AType.registerCommand("plugins", {
  args: {
    fallback: ""
  },
  argsName: [],
  description: {
    fallback: "Get a list of installed plugins/modules.",
    "en-US": "Get a list of installed plugins/modules.",
    "vi": "Lấy danh sách các plugin/module đã cài đặt.",
    "ja": "インストールされているプラグイン/モジュールのリストを取得します。"
  }
}, async data => {
  let installedModules = (await NOCOM_AType.callAPI("core", "get_registered_modules", {})) as {
    moduleID: string,
    type: string,
    namespace: string,
    displayname: string,
    running: boolean
  }[];

  let moduleList = installedModules.map(module => {
    return {
      moduleID: module.moduleID,
      type: module.type,
      namespace: module.namespace,
      displayname: module.displayname,
      running: module.running
    }
  });

  return {
    content: "Installed modules:\n\n" +
      moduleList.map(module => {
        return `- ${module.running ? "✅" : "❌"} ${module.displayname} (${module.namespace} at ID ${module.moduleID})`
      }).join("\n") +
      "\n\nInstalled plugins: (spec not defined yet)",
    attachments: []
  };
}, []);
