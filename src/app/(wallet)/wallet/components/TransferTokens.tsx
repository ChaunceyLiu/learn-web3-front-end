// components/TransferTokens.tsx
'use client'

import { useWriteContract, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import MyTokenABI from '@/../artifacts/contracts/MyToken.sol/MyToken.json'

export default function TransferTokens() {
  const { address } = useAccount()
  const {
    writeContract,
    isPending,
    isSuccess,
    error,
    reset
  } = useWriteContract()

  const handleTransfer = () => {
    if (!address) {
      alert('请先连接钱包')
      return
    }
    
    // 实际开发中应让用户输入接收地址
    const receiver = address // 这里只是示例，应替换为实际接收地址
    
    writeContract({
      address: process.env.NEXT_PUBLIC_TOKEN_CONTRACT as `0x${string}`,
      abi: MyTokenABI.abi,
      functionName: 'transfer',
      args: [
        receiver,
        parseEther('10')
      ],
    })
  }

  return (
    <div className="p-4 rounded-lg">
      <button 
        onClick={handleTransfer}
        disabled={isPending}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isPending ? '处理中...' : '转账10个MTK'}
      </button>
      
      {isSuccess && (
        <div className="mt-2">
          <p className="text-green-500">转账成功！</p>
          <button
            onClick={reset}
            className="text-blue-500 hover:underline mt-1"
          >
            清除状态
          </button>
        </div>
      )}
      
      {error && (
        <p className="text-red-500 mt-2">
          错误: {error.message}
        </p>
      )}
    </div>
  )
}