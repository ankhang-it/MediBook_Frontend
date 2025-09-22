import React, { useState } from 'react';
import { Appointment, PaymentInfo } from '../types/medical';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { CreditCard, Building2, Wallet, CheckCircle, Mail } from 'lucide-react';
import { formatCurrency, formatDate } from '../data/mockData';
import { toast } from 'sonner';

interface PaymentFormProps {
  appointment: Omit<Appointment, 'id' | 'status'>;
  doctorName: string;
  onPaymentComplete: () => void;
  onBack: () => void;
}

export function PaymentForm({ appointment, doctorName, onPaymentComplete, onBack }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: 'credit_card'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate sending email
    toast.success('Đặt lịch thành công! Email xác nhận đã được gửi.', {
      description: `Lịch khám với ${doctorName} vào ${formatDate(appointment.date)} lúc ${appointment.time}`,
      icon: <Mail className="w-4 h-4" />
    });
    
    setIsProcessing(false);
    onPaymentComplete();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl">Thanh toán</h2>
        <p className="text-muted-foreground mt-2">
          Hoàn tất thanh toán để xác nhận lịch khám
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thông tin đặt lịch */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin đặt lịch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Bác sĩ</Label>
                <p>{doctorName}</p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Bệnh nhân</Label>
                <p>{appointment.patientName}</p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Ngày khám</Label>
                <p>{formatDate(appointment.date)}</p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Giờ khám</Label>
                <p>{appointment.time}</p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Liên hệ</Label>
                <p className="text-sm">{appointment.patientPhone}</p>
                <p className="text-sm">{appointment.patientEmail}</p>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center text-lg">
                <span>Tổng thanh toán:</span>
                <span className="text-primary">{formatCurrency(appointment.consultationFee)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form thanh toán */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-6">
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5" />
                      Thẻ tín dụng/Thẻ ghi nợ
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <Label htmlFor="bank_transfer" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Building2 className="w-5 h-5" />
                      Chuyển khoản ngân hàng
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Wallet className="w-5 h-5" />
                      Thanh toán tại quầy
                    </Label>
                  </div>
                </RadioGroup>

                {/* Credit card form */}
                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Số thẻ</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentInfo.cardNumber || ''}
                          onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardHolder">Tên chủ thẻ</Label>
                        <Input
                          id="cardHolder"
                          placeholder="NGUYEN VAN A"
                          value={paymentInfo.cardHolderName || ''}
                          onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardHolderName: e.target.value }))}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">MM/YY</Label>
                          <Input
                            id="expiry"
                            placeholder="12/28"
                            value={paymentInfo.expiryDate || ''}
                            onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={paymentInfo.cvv || ''}
                            onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank transfer info */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                    <h4>Thông tin chuyển khoản:</h4>
                    <div className="text-sm space-y-2">
                      <div><strong>Ngân hàng:</strong> Vietcombank</div>
                      <div><strong>Số tài khoản:</strong> 1234567890</div>
                      <div><strong>Tên tài khoản:</strong> Bệnh viện Đa khoa Trung ương</div>
                      <div><strong>Nội dung:</strong> {appointment.patientName} - {appointment.date} - {appointment.time}</div>
                    </div>
                  </div>
                )}

                {/* Cash payment info */}
                {paymentMethod === 'cash' && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm">
                      Bạn có thể thanh toán trực tiếp tại quầy lễ tân khi đến khám. 
                      Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục.
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                    Quay lại
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full w-4 h-4 border-b-2 border-white mr-2" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Xác nhận đặt lịch
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}