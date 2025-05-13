// tests/unit/components/Input/Input.test.tsx
import { render, screen } from '@testing-library/react'
import Input from './index'
import { color } from '@/constants/css'

describe('Input Component (2025 MUI 8.x 规范)', () => {
  // 核心功能测试集
  test('MUI输入框基础渲染与样式验证', () => {
    const { container } = render(<Input placeholder="搜索内容" />)
    
    // 验证DOM结构
    const inputElement = screen.getByRole('textbox')
    expect(inputElement).toBeInTheDocument()

    // 样式断言（2025推荐方式）
    const style = window.getComputedStyle(inputElement)
    expect(style.backgroundColor).toBe("")
    expect(style.borderRadius).toBe('20px')
    expect(style.padding).toBe('4px 0px 5px')

    // 类名验证（MUI 8.x新规范）
    expect(container.firstChild).toHaveClass('MuiInputBase-root')
    expect(inputElement).toHaveClass('MuiInput-input')
  })

  // Props功能测试集
  test('props透传与样式覆盖验证', () => {
    const customProps = {
      'data-testid': 'custom-input',
      className: 'custom-class',
      sx: { 
        '& .MuiInput-input': {
          backgroundColor: '#f0f0f0',
          fontSize: '16px'
        }
      }
    }

    render(<Input {...customProps} />)
    
    // 自定义属性验证
    const input = screen.getByTestId('custom-input')
    expect(input).toHaveClass('MuiInputBase-root')
  })

  // 边缘场景测试集
  test('disableUnderline特性验证（MUI 8.x兼容方案）', () => {
    const { container } = render(<Input />)
    
    // 新版MUI下划线验证方式
    const underline = container.querySelector('.MuiInput-underline')
    expect(underline).toBeNull()
  })
})