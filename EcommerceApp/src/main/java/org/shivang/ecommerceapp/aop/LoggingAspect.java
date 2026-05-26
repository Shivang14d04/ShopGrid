package org.shivang.ecommerceapp.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class LoggingAspect {
    private static final Logger LOGGER = LoggerFactory.getLogger(LoggingAspect.class);
    @Before("execution(* org.shivang.ecommerceapp.service.*.*(..))")
    public void logMethodCall(JoinPoint jp){
        LOGGER.info("Method called " + jp.getSignature().getName());
    }

    @After("execution(* org.shivang.ecommerceapp.service.*.*(..))")
    public void logMethodExecuted(JoinPoint jp){
        LOGGER.info("Method executed " + jp.getSignature().getName());
    }

    @AfterThrowing("execution(* org.shivang.ecommerceapp.service.*.*(..))")
    public void logMethodFailure(JoinPoint jp){
        LOGGER.info("Method has some issues " + jp.getSignature().getName());
    }


    @AfterReturning("execution(* org.shivang.ecommerceapp.service.*.*(..))")
    public void logMethodExecutedSuccess(JoinPoint jp){
        LOGGER.info("Method executed successfully " + jp.getSignature().getName());
    }
}
