import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import currencies from "./types";
import {
  Card,
  Nestcard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "./index.css";
export default function App() {
  const [baseCurrency, setBaseCurrency] = useState(null);
  const [targetCurrency, setTargetCurrency] = useState(null);
  const [baseAmount, setBaseAmount] = useState(null);
  const [targetAmount, setTargetAmount] = useState(null);

  const convert = async (base, target, amount) => {
    setTargetAmount(0);
    if (base && target && amount) {
      const response = await fetch(
        `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_gwQLHjSUNhVdsdNVgWsV34bPYSaKr727Pk3Mnqmf&currencies=${target}&base_currency=${base}`
      );
      const resData = await response.json();
      const rate = Object.values(resData.data)[0];
      const convertedAmount = (amount * rate).toFixed(2);
      console.log(convertedAmount);
      setTargetAmount(convertedAmount);
    }
  };

  return (
    <>
      <Card className="w-[100vw] sm:w-[380px] ">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Currenswap</CardTitle>
          <CardDescription className="font-semibold text-base">
            Effortless currency conversion
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6">
          <Nestcard>
            <CardContent className="pt-4 pb-6 grid grid-cols-1 gap-3">
              <div className="fromhead flex justify-between">
                <CardDescription className="font-semibold text-base">
                  From
                </CardDescription>
                <CardDescription className="font-semibold text-base">
                  Currency Type
                </CardDescription>
              </div>
              <div className="fromvalues flex gap-4 text-base text-primary font-semibold items-center">
                <Input
                  type="number"
                  placeholder="Amount"
                  className="w-full text-base text-primary font-semibold"
                  onChange={(e) => setBaseAmount(e.target.value)}
                  defaultValue={baseAmount}
                ></Input>
                <div className="fromvaluetype">
                  <Select
                    onValueChange={(value) => {
                      setBaseCurrency(value);
                      console.log(value);
                    }}
                  >
                    <SelectTrigger className="w-[100px] font-semibold text-base">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="font-semibold">
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Nestcard>
          <Nestcard>
            <CardContent className="pt-4 pb-6 grid grid-cols-1 gap-3">
              <div className="tohead flex justify-between">
                <CardDescription className="font-semibold text-base">
                  To
                </CardDescription>
                <CardDescription className="font-semibold text-base">
                  Currency Type
                </CardDescription>
              </div>
              <div className="fromvalues flex gap-4 text-base text-primary font-semibold items-center">
                <Input
                  type="number"
                  placeholder="Amount"
                  className="w-full text-base text-primary font-semibold"
                  defaultValue={targetAmount}
                  readOnly
                ></Input>
                <div className="fromvaluetype">
                  <Select
                    onValueChange={(value) => {
                      setTargetCurrency(value);
                      console.log(value);
                    }}
                  >
                    <SelectTrigger className="w-[100px] font-semibold text-base">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="font-semibold">
                      {currencies.map((currency) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Nestcard>
        </CardContent>
        <CardFooter className="grid grid-cols-1 gap-3">
          <Button
            onClick={() => {
              convert(baseCurrency, targetCurrency, baseAmount);
            }}
            className="w-full text-base"
          >
            Convert
          </Button>
          <Button
            className="w-full text-base"
            onClick={() => {
              window.location.reload();
            }}
          >
            Reset
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
