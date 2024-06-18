import { useCallback, useState } from "react";
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
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("EUR");
  const [baseAmount, setBaseAmount] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_CONVERTER;

  const convert = useCallback(async (base, target, amount) => {
    try {
      setLoading(true);
      setError("");
      if (!base || !target || !amount) {
        setError("Please fill in all fields.");
        setLoading(false);
        return;
      }
      const response = await fetch(
        `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}&currencies=${target}&base_currency=${base}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rate");
      }
      const resData = await response.json();
      const rate = Object.values(resData.data)[0];
      if (!rate) {
        throw new Error("Invalid exchange rate data");
      }
      const convertedAmount = (amount * rate).toFixed(2);
      setTargetAmount(convertedAmount);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  });

  return (
    <>
      <Card className="w-[100vw] sm:w-[380px]">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Currenswap</CardTitle>
          <CardDescription className="font-semibold text-base">
            Effortless currency conversion
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6">
          {error && <p className="text-red-500 font-semibold">{error}</p>}
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
                  value={baseAmount}
                  min="0"
                ></Input>
                <div className="fromvaluetype">
                  <Select
                    onValueChange={(value) => setBaseCurrency(value)}
                    value={baseCurrency}
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
                  value={targetAmount}
                  readOnly
                ></Input>
                <div className="fromvaluetype">
                  <Select
                    onValueChange={(value) => setTargetCurrency(value)}
                    value={targetCurrency}
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
            onClick={() => convert(baseCurrency, targetCurrency, baseAmount)}
            className="w-full text-base"
            disabled={loading}
          >
            {loading ? "Converting..." : "Convert"}
          </Button>
          <Button
            className="w-full text-base"
            onClick={() => {
              setBaseCurrency("");
              setTargetCurrency("");
              setBaseAmount("");
              setTargetAmount("");
              setError("");
            }}
          >
            Reset
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
