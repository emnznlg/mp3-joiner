import { ChangeEvent } from "react";
import { useStore } from "../../store/useStore";

export function FileNameInput() {
  const { outputFileName, setOutputFileName } = useStore();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Sadece izin verilen karakterleri kabul et
    const validValue = e.target.value.replace(/[^a-zA-Z0-9-_.]/g, "");
    setOutputFileName(validValue);
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="outputFileName"
        className="text-sm font-medium text-gray-700"
      >
        Birleştirilmiş Dosya Adı
      </label>
      <div className="relative">
        <input
          type="text"
          id="outputFileName"
          name="outputFileName"
          value={outputFileName}
          onChange={handleChange}
          placeholder="Örnek: birlestirilmis-dosya"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400"
          maxLength={50}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-xs text-gray-400">.mp3</span>
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Opsiyonel. Sadece harf, rakam, tire, alt çizgi ve nokta
        kullanabilirsiniz (3-50 karakter).
      </p>
    </div>
  );
}
