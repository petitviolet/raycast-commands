import { useState, useMemo } from "react";
import { showHUD, Clipboard, List, Action, ActionPanel } from "@raycast/api";
import dayjs from "dayjs";

export default () => {
  const [input, setInput] = useState("now");

  // const input = props.arguments.input;
  const forDate: dayjs.Dayjs | undefined = useMemo(() => {
    if (input === "now") {
      return dayjs();
    }
    const unixtime = parseInt(input);
    if (isValidUnixTime(unixtime)) {
      return fromUnixTime(unixtime);
    }
    const date = dayjs(input);
    if (date.isValid()) {
      return date;
    }

    return;
  }, [input]);

  const forUnixTime: dayjs.Dayjs | undefined = useMemo(() => {
    if (input === "now") {
      return dayjs();
    }
    const _unixtime = parseInt(input);
    if (isValidUnixTime(_unixtime)) {
      return dayjs.unix(_unixtime);
    }
    const date = dayjs(input);
    if (date.isValid()) {
      return date;
    }

    return undefined;
  }, [input]);
  console.log({ input, forDate, forUnixTime });

  const unixtimeStr = forUnixTime ? `${forUnixTime.unix()}` : "";
  console.log({ message: "unixtimeStr", unixtimeStr });
  const dateStrs: string[] = useMemo(() => {
    if (!forDate) return [];
    const _date = dayjs(forDate);
    console.log({ message: "_date", _date });
    return [
      _date.format("YYYY-MM-DD HH:mm:ss"),
      _date.format("YYYY-MM-DD HH:mm:ss Z"),
      _date.format("YYYY/MM/DD HH:mm:ss"),
      _date.format("YYYY/MM/DD HH:mm:ss Z"),
      _date.format("YYYYMMDD_HHmmss"),
      _date.format("YYYY-MM-DD"),
      _date.format("YYYYMMDD"),
      _date.format("HHmmss"),
      _date.format("HH:mm:ss"),
    ];
  }, [forDate]);

  return (
    <List searchText={input} onSearchTextChange={setInput}>
      {[unixtimeStr, ...dateStrs].map((item) => {
        return (
          <List.Item
            key={item}
            title={item}
            actions={
              <ActionPanel>
                <Action
                  title="Copy"
                  onAction={async () => {
                    await Clipboard.copy(item);
                    await showHUD(`Copied ${item} to clipboard`);
                  }}
                />
              </ActionPanel>
            }
          ></List.Item>
        );
      })}
    </List>
  );
};

const toUnixTime = (date: dayjs.Dayjs): number => date.unix();
const fromUnixTime = (unixtime: number): dayjs.Dayjs => dayjs(new Date(unixtime * 1000));

const isValidUnixTime = (unixtime: number): boolean => !Number.isNaN(unixtime) && unixtime > 10000000;
